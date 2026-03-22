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
  const { is_favorite, tags } = body;

  // Validate input
  if (typeof is_favorite !== "boolean" && !Array.isArray(tags)) {
    return NextResponse.json(
      { error: "is_favorite (boolean) or tags (string[]) is required" },
      { status: 400 }
    );
  }

  if (Array.isArray(tags) && tags.length > 5) {
    return NextResponse.json(
      { error: "Maximum 5 tags allowed" },
      { status: 400 }
    );
  }

  // Verify ownership via RLS (user can only access own rows)
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!evaluation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updatePayload: Record<string, unknown> = {};
  if (typeof is_favorite === "boolean") updatePayload.is_favorite = is_favorite;
  if (Array.isArray(tags)) updatePayload.tags = tags;

  const { data: updated, error: updateError } = await supabase
    .from("evaluations")
    .update(updatePayload)
    .eq("id", id)
    .select("id, is_favorite, tags")
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }

  return NextResponse.json(updated);
}
