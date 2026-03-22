import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EvaluationReport from "@/components/EvaluationReport";
import type { EvaluationResult } from "@/lib/models";
import { averageScore } from "@/lib/models";
import type { Metadata } from "next";

async function getEvaluation(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .single();
  return data;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const data = await getEvaluation(id);

  if (!data) {
    return {
      title: "DesignEval - 評価結果",
      description: "設計レビュー評価結果",
    };
  }

  const result = data.result as EvaluationResult;
  const avg = averageScore(result).toFixed(1);
  const title = `DesignEval - ${result.overall.decision} (${result.overall.score}/5)`;
  const description = (data.problem as string).slice(0, 150);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
    },
  };
}

export default async function SharePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const data = await getEvaluation(id);

  if (!data) {
    notFound();
  }

  const result = data.result as EvaluationResult;

  return (
    <div>
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-blue-800 dark:text-blue-200 text-sm">
        この評価結果は共有リンクで公開されています
      </div>
      <h1 className="text-2xl font-bold mb-6">評価結果</h1>
      <EvaluationReport result={result} />
    </div>
  );
}
