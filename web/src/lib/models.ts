import { z } from "zod";

export const ScoreItemSchema = z.object({
  category: z.string(),
  score: z.number().min(1).max(5),
  reason: z.string(),
});

export const TradeoffAnalysisSchema = z.object({
  dimension: z.string(),
  analysis: z.string(),
});

export const ImprovementSchema = z.object({
  what: z.string(),
  why: z.string(),
  risk_reduced: z.string(),
});

export const OverallVerdictSchema = z.object({
  score: z.number().min(1).max(5),
  decision: z.string(),
  confidence: z.string(),
  summary: z.string(),
});

export const EvaluationResultSchema = z.object({
  problem_summary: z.array(z.string()),
  design_extraction: z.record(z.string(), z.string()),
  scores: z.array(ScoreItemSchema),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  tradeoffs: z.array(TradeoffAnalysisSchema),
  deep_dive_questions: z.array(z.string()),
  improvements: z.array(ImprovementSchema),
  overall: OverallVerdictSchema,
});

export type ScoreItem = z.infer<typeof ScoreItemSchema>;
export type TradeoffAnalysis = z.infer<typeof TradeoffAnalysisSchema>;
export type Improvement = z.infer<typeof ImprovementSchema>;
export type OverallVerdict = z.infer<typeof OverallVerdictSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

export interface EvaluationInput {
  problem: string;
  answer: string;
}

export function averageScore(result: EvaluationResult): number {
  if (result.scores.length === 0) return 0;
  return result.scores.reduce((sum, s) => sum + s.score, 0) / result.scores.length;
}
