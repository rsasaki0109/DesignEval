"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

export default function RetryButton({
  problem,
  answer,
  model,
}: {
  problem: string;
  answer: string;
  model: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, answer, model }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/results/${data.id}`);
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRetry}
      disabled={loading}
      className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 inline-flex items-center gap-2"
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          評価中...
        </>
      ) : (
        "再評価"
      )}
    </button>
  );
}
