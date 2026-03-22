"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { TEMPLATES } from "@/lib/templates";

const PROGRESS_MESSAGES = [
  "LLMに送信中...",
  "設計を分析中...",
  "スコアを算出中...",
  "レポートを生成中...",
];

export default function EvaluatePage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [answer, setAnswer] = useState("");
  const [model, setModel] = useState("claude-sonnet-4-20250514");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressIndex, setProgressIndex] = useState(0);

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

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, answer, model }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "評価に失敗しました");
        setLoading(false);
        return;
      }

      if (data.id) {
        router.push(`/results/${data.id}`);
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規評価</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">問題テンプレート</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setSelectedTemplate(null);
                setProblem("");
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedTemplate === null
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-blue-400"
              }`}
            >
              カスタム
            </button>
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                disabled={loading}
                onClick={() => {
                  setSelectedTemplate(tpl.id);
                  setProblem(tpl.problem);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedTemplate === tpl.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-blue-400"
                }`}
              >
                <span className="text-xs opacity-70 mr-1">{tpl.category}</span>
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">設計問題</label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={8}
            required
            disabled={loading}
            placeholder="例: URL短縮サービスを設計してください..."
            className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">受験者の回答</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={12}
            required
            disabled={loading}
            placeholder="受験者の設計回答を貼り付けてください..."
            className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
          />
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
                通常15〜30秒かかります。このページを閉じないでください。
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !problem || !answer}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? "評価中..." : "評価を実行"}
        </button>
      </form>
    </div>
  );
}
