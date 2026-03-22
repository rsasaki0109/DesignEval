"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import ScoreChart from "./ScoreChart";
import { toMarkdown } from "@/lib/output";
import { averageScore } from "@/lib/models";
import type { EvaluationResult } from "@/lib/models";

const PdfButton = dynamic(() => import("./PdfButton"), { ssr: false });

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
  evaluationId,
  isPublic: initialIsPublic,
}: {
  result: EvaluationResult;
  evaluationId?: string;
  isPublic?: boolean;
}) {
  const md = toMarkdown(result);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPublic, setIsPublic] = useState(initialIsPublic ?? false);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" && evaluationId
    ? `${window.location.origin}/share/${evaluationId}`
    : "";

  const handleToggleShare = async () => {
    if (!evaluationId) return;
    setShareLoading(true);
    try {
      const res = await fetch(`/api/share/${evaluationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: !isPublic }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsPublic(data.is_public);
      }
    } catch (err) {
      console.error("Failed to toggle share:", err);
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

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
    <div ref={reportRef} className="space-y-8">
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
          <PdfButton targetRef={reportRef} />
          {evaluationId && (
            <button
              onClick={handleToggleShare}
              disabled={shareLoading}
              className={`text-sm border rounded px-3 py-1.5 disabled:opacity-50 ${
                isPublic
                  ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {shareLoading ? "処理中..." : isPublic ? "共有中" : "共有"}
            </button>
          )}
        </div>
      </div>

      {/* Share URL */}
      {evaluationId && isPublic && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3">
          <span className="text-sm text-blue-800 dark:text-blue-200 truncate flex-1">
            {shareUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="text-sm border border-blue-300 dark:border-blue-700 rounded px-3 py-1.5 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 whitespace-nowrap"
          >
            {copied ? "コピー済み" : "コピー"}
          </button>
        </div>
      )}

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
