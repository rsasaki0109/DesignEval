import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EvaluationReport from "@/components/EvaluationReport";
import type { EvaluationResult } from "@/lib/models";

export default async function ResultPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  const result = data.result as EvaluationResult;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">評価結果</h1>
      <EvaluationReport result={result} />
    </div>
  );
}
