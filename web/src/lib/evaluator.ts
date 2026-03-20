import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";
import { EvaluationResultSchema } from "./models";
import type { EvaluationInput, EvaluationResult } from "./models";

const SYSTEM_PROMPT_PATH = resolve(process.cwd(), "..", "prompts", "system_prompt.md");

let cachedSystemPrompt: string | null = null;

function loadSystemPrompt(): string {
  if (!cachedSystemPrompt) {
    cachedSystemPrompt = readFileSync(SYSTEM_PROMPT_PATH, "utf-8");
  }
  return cachedSystemPrompt;
}

function buildUserMessage(input: EvaluationInput): string {
  return `## 設計問題\n\n${input.problem}\n\n## 受験者の回答\n\n${input.answer}\n\n上記の設計問題と回答を評価してください。指定されたJSONスキーマに従って純粋なJSONのみを返してください。`;
}

export async function evaluate(
  input: EvaluationInput,
  options?: { model?: string }
): Promise<EvaluationResult> {
  const client = new Anthropic();
  const systemPrompt = loadSystemPrompt();
  const userMessage = buildUserMessage(input);

  const response = await client.messages.create({
    model: options?.model ?? "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    temperature: 0.3,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned empty response");
  }

  // Extract JSON from response (may be wrapped in ```json ... ```)
  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const data = JSON.parse(jsonStr);
  return EvaluationResultSchema.parse(data);
}
