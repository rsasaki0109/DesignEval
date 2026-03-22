import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: evaluations, error } = await supabase
    .from("evaluations")
    .select("created_at, problem, average_score, decision, model")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch evaluations" }, { status: 500 });
  }

  // CSV header
  const header = "日付,問題,平均スコア,判定,モデル";

  const rows = (evaluations ?? []).map((ev) => {
    const date = new Date(ev.created_at).toLocaleDateString("ja-JP");
    const problem = ev.problem.slice(0, 100).replace(/"/g, '""').replace(/[\r\n]+/g, " ");
    const score = ev.average_score;
    const decision = ev.decision;
    const model = ev.model ?? "";
    return `${date},"${problem}",${score},${decision},${model}`;
  });

  const csvContent = [header, ...rows].join("\r\n");

  // UTF-8 BOM for Excel compatibility
  const bom = "\uFEFF";
  const body = bom + csvContent;

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="evaluations.csv"',
    },
  });
}
