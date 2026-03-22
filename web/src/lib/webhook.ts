import type { EvaluationResult } from "@/lib/models";
import { averageScore } from "@/lib/models";

export async function sendWebhook(url: string, payload: object): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}`);
  }
}

function isDiscordUrl(url: string): boolean {
  return url.toLowerCase().includes("discord");
}

function formatSlackPayload(result: EvaluationResult, problemExcerpt: string) {
  const avg = averageScore(result).toFixed(1);
  const text = `DesignEval: ${result.overall.decision} (${result.overall.score}/5, avg: ${avg})`;

  return {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "DesignEval 評価完了",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*総合スコア:* ${result.overall.score}/5`,
          },
          {
            type: "mrkdwn",
            text: `*平均スコア:* ${avg}/5`,
          },
          {
            type: "mrkdwn",
            text: `*判定:* ${result.overall.decision}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*問題概要:*\n${problemExcerpt}`,
        },
      },
    ],
  };
}

function formatDiscordPayload(result: EvaluationResult, problemExcerpt: string) {
  const avg = averageScore(result).toFixed(1);
  const content = `DesignEval: ${result.overall.decision} (${result.overall.score}/5, avg: ${avg})`;

  return {
    content,
    embeds: [
      {
        title: "DesignEval 評価完了",
        fields: [
          { name: "総合スコア", value: `${result.overall.score}/5`, inline: true },
          { name: "平均スコア", value: `${avg}/5`, inline: true },
          { name: "判定", value: result.overall.decision, inline: true },
          { name: "問題概要", value: problemExcerpt },
        ],
      },
    ],
  };
}

export async function notifyEvaluationComplete(
  result: EvaluationResult,
  webhookUrl: string,
  problem?: string,
): Promise<void> {
  const problemExcerpt = problem ? problem.slice(0, 150) : "";

  const payload = isDiscordUrl(webhookUrl)
    ? formatDiscordPayload(result, problemExcerpt)
    : formatSlackPayload(result, problemExcerpt);

  await sendWebhook(webhookUrl, payload);
}
