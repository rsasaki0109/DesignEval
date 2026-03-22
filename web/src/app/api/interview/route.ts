import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT =
  "あなたはシステム設計面接の面接官です。受験者に設計について深掘り質問をしてください。質問は具体的で、スケーラビリティ、障害対応、トレードオフなどの観点から行ってください。一度に1つの質問だけしてください。";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { messages, topic } = body;

  if (!messages || !topic) {
    return NextResponse.json(
      { error: "messages and topic are required" },
      { status: 400 }
    );
  }

  const client = new Anthropic();

  const systemPrompt = `${SYSTEM_PROMPT}\n\n面接のトピック: ${topic}`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      temperature: 0.7,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude returned empty response");
    }

    return NextResponse.json({ message: textBlock.text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Interview request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
