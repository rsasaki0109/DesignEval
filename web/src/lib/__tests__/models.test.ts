import { describe, it, expect } from "vitest";
import {
  ScoreItemSchema,
  EvaluationResultSchema,
  OverallVerdictSchema,
  averageScore,
} from "../models";
import type { EvaluationResult } from "../models";

function makeMinimalResult(
  overrides: Partial<EvaluationResult> = {}
): EvaluationResult {
  return {
    problem_summary: ["test problem"],
    design_extraction: { key: "value" },
    scores: [{ category: "test", score: 3, reason: "ok" }],
    strengths: ["good"],
    weaknesses: ["bad"],
    tradeoffs: [{ dimension: "a vs b", analysis: "balanced" }],
    deep_dive_questions: ["why?"],
    improvements: [{ what: "fix", why: "broken", risk_reduced: "risk" }],
    overall: {
      score: 3,
      decision: "Lean No",
      confidence: "Medium",
      summary: "summary",
    },
    ...overrides,
  };
}

describe("ScoreItemSchema", () => {
  it("accepts valid scores 1-5", () => {
    for (const score of [1, 2, 3, 4, 5]) {
      const result = ScoreItemSchema.safeParse({
        category: "test",
        score,
        reason: "ok",
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects score below 1", () => {
    const result = ScoreItemSchema.safeParse({
      category: "test",
      score: 0,
      reason: "ok",
    });
    expect(result.success).toBe(false);
  });

  it("rejects score above 5", () => {
    const result = ScoreItemSchema.safeParse({
      category: "test",
      score: 6,
      reason: "ok",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = ScoreItemSchema.safeParse({ category: "test" });
    expect(result.success).toBe(false);
  });
});

describe("OverallVerdictSchema", () => {
  it("accepts valid verdict", () => {
    const result = OverallVerdictSchema.safeParse({
      score: 4,
      decision: "Yes",
      confidence: "High",
      summary: "good",
    });
    expect(result.success).toBe(true);
  });

  it("rejects score out of range", () => {
    const result = OverallVerdictSchema.safeParse({
      score: 0,
      decision: "No",
      confidence: "Low",
      summary: "bad",
    });
    expect(result.success).toBe(false);
  });
});

describe("EvaluationResultSchema", () => {
  it("accepts a valid complete result", () => {
    const data = makeMinimalResult();
    const result = EvaluationResultSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = EvaluationResultSchema.safeParse({
      problem_summary: ["test"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid score in scores array", () => {
    const data = makeMinimalResult({
      scores: [{ category: "test", score: 10, reason: "ok" }],
    });
    const result = EvaluationResultSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("averageScore", () => {
  it("calculates average correctly", () => {
    const result = makeMinimalResult({
      scores: [
        { category: "a", score: 2, reason: "r" },
        { category: "b", score: 4, reason: "r" },
      ],
    });
    expect(averageScore(result)).toBe(3);
  });

  it("returns 0 for empty scores", () => {
    const result = makeMinimalResult({ scores: [] });
    expect(averageScore(result)).toBe(0);
  });

  it("returns exact score for single item", () => {
    const result = makeMinimalResult({
      scores: [{ category: "a", score: 5, reason: "r" }],
    });
    expect(averageScore(result)).toBe(5);
  });
});
