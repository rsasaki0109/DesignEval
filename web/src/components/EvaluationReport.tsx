"use client";

import ReactMarkdown from "react-markdown";
import ScoreChart from "./ScoreChart";
import { toMarkdown } from "@/lib/output";
import { averageScore } from "@/lib/models";
import type { EvaluationResult } from "@/lib/models";

function decisionColor(decision: string): string {
  if (decision.includes("Strong Yes")) return "text-green-600";
  if (decision.includes("Yes")) return "text-green-500";
  if (decision.includes("Lean Yes")) return "text-lime-500";
  if (decision.includes("Lean No")) return "text-orange-500";
  if (decision.includes("Strong No")) return "text-red-600";
  if (decision.includes("No")) return "text-red-500";
  return "text-gray-600";
}

export default function EvaluationReport({
  result,
}: {
  result: EvaluationResult;
}) {
  const md = toMarkdown(result);

  const handleDownloadMd = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evaluation_report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evaluation_result.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Summary card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold">{result.overall.score}/5</div>
          <div className="text-sm text-gray-500 mt-1">総合スコア</div>
        </div>
        <div>
          <div className={`text-2xl font-semibold ${decisionColor(result.overall.decision)}`}>
            {result.overall.decision}
          </div>
          <div className="text-sm text-gray-500">
            平均: {averageScore(result).toFixed(1)}/5 | 信頼度: {result.overall.confidence}
          </div>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button
            onClick={handleDownloadMd}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Markdown
          </button>
          <button
            onClick={handleDownloadJson}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Radar chart */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">スコアチャート</h2>
        <ScoreChart scores={result.scores} />
      </div>

      {/* Full report */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 prose dark:prose-invert max-w-none">
        <ReactMarkdown>{md}</ReactMarkdown>
      </div>
    </div>
  );
}
