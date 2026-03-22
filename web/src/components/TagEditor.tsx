"use client";

import { useState } from "react";

export default function TagEditor({
  evaluationId,
  initialTags,
}: {
  evaluationId: string;
  initialTags: string[];
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState("");

  const saveTags = async (newTags: string[]) => {
    try {
      await fetch(`/api/evaluations/${evaluationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags }),
      });
    } catch (err) {
      console.error("Failed to save tags:", err);
    }
  };

  const handleAdd = () => {
    const tag = input.trim();
    if (!tag || tags.includes(tag) || tags.length >= 5) return;
    const newTags = [...tags, tag];
    setTags(newTags);
    setInput("");
    saveTags(newTags);
  };

  const handleRemove = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    saveTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={() => handleRemove(tag)}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          title="クリックで削除"
        >
          {tag}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </span>
      ))}
      {tags.length < 5 && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="タグ追加..."
          className="text-xs border rounded px-2 py-0.5 w-24 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}
    </div>
  );
}
