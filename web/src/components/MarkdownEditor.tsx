"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <MarkdownEditorFallback />,
});

function MarkdownEditorFallback() {
  return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 h-[300px] flex items-center justify-center text-gray-400">
      Loading editor...
    </div>
  );
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your design document in Markdown...",
  height = 300,
}: MarkdownEditorProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div data-color-mode="auto" className="w-full">
      {!loaded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ height, display: loaded ? "none" : undefined }}
        />
      )}
      <div style={{ display: loaded ? undefined : "none" }}>
        <MDEditor
          value={value}
          onChange={(val) => {
            if (!loaded) setLoaded(true);
            onChange(val ?? "");
          }}
          onHeightChange={() => {
            if (!loaded) setLoaded(true);
          }}
          height={height}
          preview="edit"
          textareaProps={{ placeholder }}
        />
      </div>
    </div>
  );
}
