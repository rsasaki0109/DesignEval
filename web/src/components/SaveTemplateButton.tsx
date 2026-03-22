"use client";

import { useState } from "react";

export default function SaveTemplateButton({ problem }: { problem: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("カスタム");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!title || !problem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, problem }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => {
          setOpen(false);
          setSaved(false);
          setTitle("");
          setCategory("カスタム");
        }, 1200);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!problem}
        className="border border-gray-300 dark:border-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        テンプレート保存
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md mx-4 space-y-4">
            <h2 className="text-lg font-bold">テンプレートとして保存</h2>

            <div>
              <label className="block text-sm font-medium mb-1">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: マイクロサービス設計"
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                カテゴリ
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="カスタム"
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm"
              />
            </div>

            {saved && (
              <p className="text-sm text-green-600 dark:text-green-400">
                保存しました
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTitle("");
                  setCategory("カスタム");
                }}
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || !title}
                className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
