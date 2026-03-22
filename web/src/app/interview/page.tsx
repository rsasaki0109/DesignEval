"use client";

import { useState, useRef, useEffect } from "react";
import Spinner from "@/components/Spinner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function InterviewPage() {
  const [topic, setTopic] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendToAI = async (allMessages: Message[]) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!topic.trim()) return;
    setStarted(true);
    const initial: Message[] = [
      {
        role: "user",
        content: `このトピックについて設計面接を始めてください: ${topic}`,
      },
    ];
    setMessages(initial);
    await sendToAI(initial);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    await sendToAI(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <h1 className="text-2xl font-bold mb-2">AI面接モード</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          設計トピックを入力すると、AIが面接官として深掘り質問をします。
        </p>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">設計トピック</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStart();
              }}
              placeholder="例: 大規模SNSのタイムライン設計"
              className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-900"
            />
          </div>
          <button
            onClick={handleStart}
            disabled={!topic.trim()}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            面接を開始
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="border-b border-gray-200 dark:border-gray-800 py-3 px-1 flex-shrink-0">
        <h1 className="text-lg font-bold">AI面接モード</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          トピック: {topic}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
              <Spinner />
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 py-3 px-1 flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={loading}
            placeholder="回答を入力... (Enter で送信、Shift+Enter で改行)"
            className="flex-1 border rounded-lg px-4 py-2.5 bg-white dark:bg-gray-900 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors self-end"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
