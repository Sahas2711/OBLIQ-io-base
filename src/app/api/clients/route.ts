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
  const entityType = searchParams.get("entityType") || "";

  let query = supabase
    .from("clients")
    .select(`
      *,
      assigned_user:profiles!clients_assigned_to_fkey(full_name),
      tasks:compliance_tasks(count),
      overdue_tasks:compliance_tasks(count).eq(status, "overdue")
    `)
    .eq("firm_id", profile.firm_id)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,pan.ilike.%${search}%`);
  }
  if (status) query = query.eq("status", status);
  if (entityType) query = query.eq("entity_type", entityType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ clients: data });
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
    .from("clients")
    .insert({
      firm_id: profile.firm_id,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      pan: body.pan || null,
      entity_type: body.entityType,
      status: body.status || "active",
      firm_name: body.firmName || null,
      assigned_to: body.assignedTo || null,
      compliance_types: body.complianceTypes || [],
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log activity
  await supabase.from("activities").insert({
    firm_id: profile.firm_id,
    user_id: user.id,
    user_name: profile.full_name,
    action: "client_added",
    description: `added new client`,
    client_id: data.id,
    client_name: data.name,
  });

  return NextResponse.json({ client: data }, { status: 201 });
}
