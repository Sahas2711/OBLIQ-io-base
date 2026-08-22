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
    .from("clients")
    .select(`
      *,
      assigned_user:profiles!clients_assigned_to_fkey(full_name, id),
      tasks:compliance_tasks(*, assignee:profiles!compliance_tasks_assigned_to_fkey(full_name)),
      documents:documents(*),
      activities:activities(*)
    `)
    .eq("id", id)
    .eq("firm_id", profile.firm_id)
    .single();

  if (error) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  return NextResponse.json({ client: data });
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

  const { data, error } = await supabase
    .from("clients")
    .update({
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      pan: body.pan || null,
      entity_type: body.entityType,
      firm_name: body.firmName || null,
      assigned_to: body.assignedTo || null,
      compliance_types: body.complianceTypes || [],
      notes: body.notes || null,
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("firm_id", profile.firm_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ client: data });
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
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("firm_id", profile.firm_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
