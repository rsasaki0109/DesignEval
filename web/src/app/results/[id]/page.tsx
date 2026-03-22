import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EvaluationReport from "@/components/EvaluationReport";
import RetryButton from "@/components/RetryButton";
import FavoriteButton from "@/components/FavoriteButton";
import TagEditor from "@/components/TagEditor";
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
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">評価結果</h1>
        <FavoriteButton
          evaluationId={data.id}
          initialFavorite={data.is_favorite ?? false}
        />
      </div>
      <EvaluationReport
        result={result}
        evaluationId={data.id}
        isPublic={data.is_public ?? false}
      />
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <RetryButton
          problem={data.problem}
          answer={data.answer}
          model={data.model}
        />
        <TagEditor
          evaluationId={data.id}
          initialTags={data.tags ?? []}
        />
      </div>
    </div>
  );
}
