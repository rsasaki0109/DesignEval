import { describe, it, expect } from "vitest";
import { toMarkdown } from "../output";
import type { EvaluationResult } from "../models";

function makeMinimalResult(): EvaluationResult {
  return {
    problem_summary: ["Design a URL shortener"],
    design_extraction: { purpose: "Shorten URLs" },
    scores: [
      { category: "Requirements", score: 4, reason: "Good coverage" },
      { category: "Scalability", score: 3, reason: "Needs work" },
    ],
    strengths: ["Clear requirements analysis"],
    weaknesses: ["Missing security considerations"],
    tradeoffs: [
      { dimension: "Latency vs Cost", analysis: "Cache adds cost but reduces latency" },
    ],
    deep_dive_questions: ["How would you handle rate limiting?"],
    improvements: [
      { what: "Add monitoring", why: "Ops visibility", risk_reduced: "Silent failures" },
    ],
    overall: {
      score: 4,
      decision: "Lean Yes",
      confidence: "High",
      summary: "Solid design with minor gaps.",
    },
  };
}

describe("toMarkdown", () => {
  it("contains the report title", () => {
    const md = toMarkdown(makeMinimalResult());
    expect(md).toContain("# DesignEval 評価レポート");
  });

  it("contains all 9 sections", () => {
    const md = toMarkdown(makeMinimalResult());
    const sections = [
      "## 1. 問題の整理",
      "## 2. 設計内容の抽出",
      "## 3. 評価スコア",
      "## 4. 良かった点",
      "## 5. 弱い点・不足点",
      "## 6. トレードオフ分析",
      "## 7. 面接官向けの深掘り質問",
      "## 8. 改善提案",
      "## 9. 総合評価",
    ];
    for (const section of sections) {
      expect(md).toContain(section);
    }
  });

  it("contains the score table header", () => {
    const md = toMarkdown(makeMinimalResult());
    expect(md).toContain("| 観点 | スコア | 理由 |");
    expect(md).toContain("|------|--------|------|");
  });

  it("contains score entries", () => {
    const md = toMarkdown(makeMinimalResult());
    expect(md).toContain("Requirements");
    expect(md).toContain("4/5");
    expect(md).toContain("Scalability");
    expect(md).toContain("3/5");
  });

  it("contains the average score", () => {
    const md = toMarkdown(makeMinimalResult());
    expect(md).toContain("平均スコア: 3.5/5");
  });

  it("contains strengths and weaknesses", () => {
    const md = toMarkdown(makeMinimalResult());
    expect(md).toContain("Clear requirements analysis");
    expect(md).toContain("Missing security considerations");
  });

  it("contains improvements", () => {
    const md = toMarkdown(makeMinimalResult());
    expect(md).toContain("Add monitoring");
    expect(md).toContain("Ops visibility");
  });

  it("contains overall verdict details", () => {
    const md = toMarkdown(makeMinimalResult());
    expect(md).toContain("Lean Yes");
    expect(md).toContain("High");
    expect(md).toContain("Solid design with minor gaps.");
  });
});
