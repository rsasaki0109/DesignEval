"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import type { EvaluationResult } from "@/lib/models";

const PROGRESS_MESSAGES = [
  "LLMに送信中...",
  "2つの回答を分析中...",
  "スコアを算出中...",
  "比較レポートを生成中...",
];

interface CompareResult {
  result: EvaluationResult;
  id?: string;
}

export default function ComparePage() {
  const [problem, setProblem] = useState("");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [model, setModel] = useState("claude-sonnet-4-20250514");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressIndex, setProgressIndex] = useState(0);
  const [resultA, setResultA] = useState<CompareResult | null>(null);
  const [resultB, setResultB] = useState<CompareResult | null>(null);

  useEffect(() => {
    if (!loading) {
      setProgressIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setProgressIndex((prev) =>
        prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProgressIndex(0);
    setResultA(null);
    setResultB(null);

    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem, answer: answerA, model }),
        }),
        fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem, answer: answerB, model }),
        }),
      ]);

      const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);

      if (!resA.ok || !resB.ok) {
        setError(dataA.error || dataB.error || "評価に失敗しました");
        setLoading(false);
        return;
      }

      setResultA({ result: dataA.result, id: dataA.id });
      setResultB({ result: dataB.result, id: dataB.id });
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  const hasResults = resultA && resultB;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">回答比較</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">設計問題</label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={6}
            required
            disabled={loading}
            placeholder="例: URL短縮サービスを設計してください..."
            className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">回答 A</label>
            <textarea
              value={answerA}
              onChange={(e) => setAnswerA(e.target.value)}
              rows={10}
              required
              disabled={loading}
              placeholder="候補者Aの回答を貼り付けてください..."
              className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">回答 B</label>
            <textarea
              value={answerB}
              onChange={(e) => setAnswerB(e.target.value)}
              rows={10}
              required
              disabled={loading}
              placeholder="候補者Bの回答を貼り付けてください..."
              className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">モデル</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={loading}
            className="border rounded px-3 py-2 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
            <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
          </select>
        </div>

        {error && (
          <div className="flex items-start gap-3 text-red-600 text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <svg
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <Spinner />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300">
                {PROGRESS_MESSAGES[progressIndex]}
              </p>
              <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">
                2つの回答を並列評価中です。通常30〜60秒かかります。
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !problem || !answerA || !answerB}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? "比較中..." : "比較を実行"}
        </button>
      </form>

      {hasResults && (
        <div className="mt-10 space-y-8">
          {/* Overall comparison header */}
          <div className="grid grid-cols-2 gap-6">
            <OverallCard label="回答 A" result={resultA.result} isWinner={resultA.result.overall.score > resultB.result.overall.score} />
            <OverallCard label="回答 B" result={resultB.result} isWinner={resultB.result.overall.score > resultA.result.overall.score} />
          </div>

          {/* Score comparison table */}
          <div>
            <h2 className="text-lg font-bold mb-4">カテゴリ別スコア比較</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th className="text-left px-4 py-3 font-medium">カテゴリ</th>
                    <th className="text-center px-4 py-3 font-medium">回答 A</th>
                    <th className="text-center px-4 py-3 font-medium">回答 B</th>
                  </tr>
                </thead>
                <tbody>
                  {resultA.result.scores.map((scoreA, i) => {
                    const scoreB = resultB.result.scores.find(
                      (s) => s.category === scoreA.category
                    );
                    const bScore = scoreB?.score ?? 0;
                    const aWins = scoreA.score > bScore;
                    const bWins = bScore > scoreA.score;

                    return (
                      <tr
                        key={scoreA.category}
                        className={i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}
                      >
                        <td className="px-4 py-3">{scoreA.category}</td>
                        <td
                          className={`px-4 py-3 text-center font-semibold ${
                            aWins ? "text-green-600 dark:text-green-400" : ""
                          }`}
                        >
                          {scoreA.score} / 5
                        </td>
                        <td
                          className={`px-4 py-3 text-center font-semibold ${
                            bWins ? "text-green-600 dark:text-green-400" : ""
                          }`}
                        >
                          {bScore} / 5
                        </td>
                      </tr>
                    );
                  })}
                  {/* Categories only in B */}
                  {resultB.result.scores
                    .filter((sB) => !resultA.result.scores.find((sA) => sA.category === sB.category))
                    .map((scoreB, i) => (
                      <tr
                        key={scoreB.category}
                        className={(resultA.result.scores.length + i) % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}
                      >
                        <td className="px-4 py-3">{scoreB.category}</td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-400">-</td>
                        <td className="px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400">
                          {scoreB.score} / 5
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverallCard({
  label,
  result,
  isWinner,
}: {
  label: string;
  result: EvaluationResult;
  isWinner: boolean;
}) {
  return (
    <div
      className={`border rounded-lg p-6 ${
        isWinner
          ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950"
          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-lg font-bold">{label}</h3>
        {isWinner && (
          <span className="text-xs font-semibold bg-green-600 text-white px-2 py-0.5 rounded">
            WINNER
          </span>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold">
          {result.overall.score}
          <span className="text-base font-normal text-gray-500"> / 5</span>
        </p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {result.overall.decision}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {result.overall.summary}
        </p>
      </div>
    </div>
  );
}
