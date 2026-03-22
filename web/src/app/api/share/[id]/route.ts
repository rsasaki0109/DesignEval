import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { is_public } = body;

  if (typeof is_public !== "boolean") {
    return NextResponse.json(
      { error: "is_public (boolean) is required" },
      { status: 400 }
    );
  }

  // Verify ownership
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!evaluation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("evaluations")
    .update({ is_public })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, is_public });
}
