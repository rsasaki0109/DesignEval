import type { EvaluationResult } from "./models";
import { averageScore } from "./models";

export function toMarkdown(result: EvaluationResult): string {
  const lines: string[] = [];

  lines.push("# DesignEval 評価レポート\n");

  // 1. Problem summary
  lines.push("## 1. 問題の整理\n");
  for (const item of result.problem_summary) {
    lines.push(`- ${item}`);
  }
  lines.push("");

  // 2. Design extraction
  lines.push("## 2. 設計内容の抽出\n");
  for (const [key, value] of Object.entries(result.design_extraction)) {
    lines.push(`### ${key}\n`);
    lines.push(`${value}\n`);
  }

  // 3. Scores
  lines.push("## 3. 評価スコア\n");
  lines.push("| 観点 | スコア | 理由 |");
  lines.push("|------|--------|------|");
  for (const s of result.scores) {
    lines.push(`| ${s.category} | ${s.score}/5 | ${s.reason} |`);
  }
  lines.push(`\n**平均スコア: ${averageScore(result).toFixed(1)}/5**\n`);

  // 4. Strengths
  lines.push("## 4. 良かった点\n");
  for (const item of result.strengths) {
    lines.push(`- ${item}`);
  }
  lines.push("");

  // 5. Weaknesses
  lines.push("## 5. 弱い点・不足点\n");
  for (const item of result.weaknesses) {
    lines.push(`- ${item}`);
  }
  lines.push("");

  // 6. Tradeoffs
  lines.push("## 6. トレードオフ分析\n");
  for (const t of result.tradeoffs) {
    lines.push(`### ${t.dimension}\n`);
    lines.push(`${t.analysis}\n`);
  }

  // 7. Deep dive questions
  lines.push("## 7. 面接官向けの深掘り質問\n");
  result.deep_dive_questions.forEach((q, i) => {
    lines.push(`${i + 1}. ${q}`);
  });
  lines.push("");

  // 8. Improvements
  lines.push("## 8. 改善提案\n");
  result.improvements.forEach((imp, i) => {
    lines.push(`### 改善${i + 1}: ${imp.what}\n`);
    lines.push(`- **理由**: ${imp.why}`);
    lines.push(`- **軽減するリスク**: ${imp.risk_reduced}\n`);
  });

  // 9. Overall
  lines.push("## 9. 総合評価\n");
  lines.push(`- **総合スコア**: ${result.overall.score}/5`);
  lines.push(`- **判定**: ${result.overall.decision}`);
  lines.push(`- **信頼度**: ${result.overall.confidence}`);
  lines.push(`\n${result.overall.summary}\n`);

  return lines.join("\n");
}
