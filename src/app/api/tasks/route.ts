import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("firm_id")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const category = searchParams.get("category") || "";
  const clientId = searchParams.get("clientId") || "";
  const filter = searchParams.get("filter") || ""; // today, this_week, overdue, waiting, high_priority

  let query = supabase
    .from("compliance_tasks")
    .select(`
      *,
      client:clients(id, name),
      assignee:profiles!compliance_tasks_assigned_to_fkey(full_name)
    `)
    .eq("firm_id", profile.firm_id)
    .order("due_date", { ascending: true });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (category) query = query.eq("category", category);
  if (clientId) query = query.eq("client_id", clientId);

  // Quick filters
  if (filter === "today") {
    const today = new Date().toISOString().split("T")[0];
    query = query.eq("due_date", today);
  } else if (filter === "this_week") {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);
    query = query.gte("due_date", now.toISOString().split("T")[0]);
    query = query.lte("due_date", endOfWeek.toISOString().split("T")[0]);
  } else if (filter === "overdue") {
    query = query.eq("status", "overdue");
  } else if (filter === "waiting") {
    query = query.eq("status", "awaiting_documents");
  } else if (filter === "high_priority") {
    query = query.in("priority", ["high", "urgent"]);
  } else if (filter === "completed") {
    query = query.eq("status", "completed");
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ tasks: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("firm_id, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json();

  const { data, error } = await supabase
    .from("compliance_tasks")
    .insert({
      firm_id: profile.firm_id,
      client_id: body.clientId,
      title: body.title,
      description: body.description || null,
      category: body.category,
      status: "not_started",
      priority: body.priority,
      assigned_to: body.assignedTo || null,
      due_date: body.dueDate,
      financial_year: body.financialYear || null,
      period: body.period || null,
      document_required: body.documentRequired || false,
      documents_total: body.documentsTotal || 0,
      notes: body.notes || null,
    })
    .select(`
      *,
      client:clients(id, name)
    `)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log activity
  await supabase.from("activities").insert({
    firm_id: profile.firm_id,
    user_id: user.id,
    user_name: profile.full_name,
    action: "task_created",
    description: `created task: ${data.title}`,
    client_id: body.clientId,
  });

  return NextResponse.json({ task: data }, { status: 201 });
}
