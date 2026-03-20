"""Pydantic models for evaluation input/output."""

from __future__ import annotations

from pydantic import BaseModel, Field


class ScoreItem(BaseModel):
    """Individual evaluation score."""

    category: str
    score: int = Field(ge=1, le=5)
    reason: str


class TradeoffAnalysis(BaseModel):
    """Trade-off analysis item."""

    dimension: str  # e.g. "レイテンシ vs コスト"
    analysis: str  # analysis or "未考慮"


class Improvement(BaseModel):
    """Improvement suggestion."""

    what: str
    why: str
    risk_reduced: str


class OverallVerdict(BaseModel):
    """Final verdict."""

    score: int = Field(ge=1, le=5)
    decision: str  # Strong No / No / Lean No / Lean Yes / Yes / Strong Yes
    confidence: str  # Low / Medium / High
    summary: str


class EvaluationResult(BaseModel):
    """Complete evaluation result."""

    problem_summary: list[str]
    design_extraction: dict[str, str]
    scores: list[ScoreItem]
    strengths: list[str]
    weaknesses: list[str]
    tradeoffs: list[TradeoffAnalysis]
    deep_dive_questions: list[str]
    improvements: list[Improvement]
    overall: OverallVerdict

    def average_score(self) -> float:
        if not self.scores:
            return 0.0
        return sum(s.score for s in self.scores) / len(self.scores)


class EvaluationInput(BaseModel):
    """Input for evaluation."""

    problem: str
    answer: str
