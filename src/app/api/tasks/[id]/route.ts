import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("firm_id")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("compliance_tasks")
    .select(`
      *,
      client:clients(id, name, pan, entity_type),
      assignee:profiles!compliance_tasks_assigned_to_fkey(full_name, id),
      notes:task_notes(*, user:profiles(full_name)),
      documents:documents(*)
    `)
    .eq("id", id)
    .eq("firm_id", profile.firm_id)
    .single();

  if (error) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json({ task: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description || null;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.status !== undefined) {
    updateData.status = body.status;
    if (body.status === "completed") updateData.completed_at = new Date().toISOString();
  }
  if (body.assignedTo !== undefined) updateData.assigned_to = body.assignedTo || null;
  if (body.dueDate !== undefined) updateData.due_date = body.dueDate;
  if (body.financialYear !== undefined) updateData.financial_year = body.financialYear || null;
  if (body.period !== undefined) updateData.period = body.period || null;
  if (body.documentRequired !== undefined) updateData.document_required = body.documentRequired;
  if (body.documentsTotal !== undefined) updateData.documents_total = body.documentsTotal;
  if (body.notes !== undefined) updateData.notes = body.notes || null;

  const { data, error } = await supabase
    .from("compliance_tasks")
    .update(updateData)
    .eq("id", id)
    .eq("firm_id", profile.firm_id)
    .select(`
      *,
      client:clients(id, name),
      assignee:profiles!compliance_tasks_assigned_to_fkey(full_name)
    `)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log status changes
  if (body.status) {
    await supabase.from("activities").insert({
      firm_id: profile.firm_id,
      user_id: user.id,
      user_name: profile.full_name,
      action: "task_status_changed",
      description: `changed status to ${body.status.replace(/_/g, " ")}`,
      client_id: data.client_id,
    });
  }

  return NextResponse.json({ task: data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("firm_id")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { error } = await supabase
    .from("compliance_tasks")
    .delete()
    .eq("id", id)
    .eq("firm_id", profile.firm_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
