"""Tests for design_eval.models."""

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from design_eval.models import EvaluationResult, ScoreItem, OverallVerdict

SAMPLES_DIR = Path(__file__).resolve().parent.parent / "samples"


@pytest.fixture
def sample_data() -> dict:
    """Load the example output result JSON."""
    with open(SAMPLES_DIR / "example_output_result.json") as f:
        return json.load(f)


@pytest.fixture
def sample_result(sample_data: dict) -> EvaluationResult:
    """Parse sample data into an EvaluationResult."""
    return EvaluationResult.model_validate(sample_data)


class TestEvaluationResultFromSample:
    """Test that EvaluationResult can be created from sample JSON."""

    def test_parse_sample_json(self, sample_result: EvaluationResult) -> None:
        assert isinstance(sample_result, EvaluationResult)

    def test_problem_summary_populated(self, sample_result: EvaluationResult) -> None:
        assert len(sample_result.problem_summary) > 0

    def test_scores_populated(self, sample_result: EvaluationResult) -> None:
        assert len(sample_result.scores) == 12

    def test_overall_verdict(self, sample_result: EvaluationResult) -> None:
        assert sample_result.overall.decision == "Lean Yes"
        assert sample_result.overall.confidence == "High"
        assert sample_result.overall.score == 4

    def test_design_extraction_is_dict(self, sample_result: EvaluationResult) -> None:
        assert isinstance(sample_result.design_extraction, dict)
        assert len(sample_result.design_extraction) > 0

    def test_improvements_populated(self, sample_result: EvaluationResult) -> None:
        assert len(sample_result.improvements) > 0
        imp = sample_result.improvements[0]
        assert imp.what
        assert imp.why
        assert imp.risk_reduced


class TestAverageScore:
    """Test average_score calculation."""

    def test_average_from_sample(self, sample_result: EvaluationResult) -> None:
        avg = sample_result.average_score()
        # 5+4+4+4+4+3+4+2+1+5+4+4 = 44, /12 = 3.666...
        assert abs(avg - (44 / 12)) < 1e-9

    def test_average_single_score(self) -> None:
        result = EvaluationResult(
            problem_summary=["test"],
            design_extraction={"key": "value"},
            scores=[ScoreItem(category="test", score=3, reason="ok")],
            strengths=[],
            weaknesses=[],
            tradeoffs=[],
            deep_dive_questions=[],
            improvements=[],
            overall=OverallVerdict(
                score=3, decision="Lean No", confidence="Medium", summary="s"
            ),
        )
        assert result.average_score() == 3.0

    def test_average_empty_scores(self) -> None:
        result = EvaluationResult(
            problem_summary=["test"],
            design_extraction={"key": "value"},
            scores=[],
            strengths=[],
            weaknesses=[],
            tradeoffs=[],
            deep_dive_questions=[],
            improvements=[],
            overall=OverallVerdict(
                score=3, decision="No", confidence="Low", summary="s"
            ),
        )
        assert result.average_score() == 0.0


class TestScoreValidation:
    """Test that scores must be 1-5."""

    @pytest.mark.parametrize("valid_score", [1, 2, 3, 4, 5])
    def test_valid_scores(self, valid_score: int) -> None:
        item = ScoreItem(category="test", score=valid_score, reason="ok")
        assert item.score == valid_score

    @pytest.mark.parametrize("invalid_score", [0, -1, 6, 10, 100])
    def test_invalid_scores_raise_validation_error(self, invalid_score: int) -> None:
        with pytest.raises(ValidationError):
            ScoreItem(category="test", score=invalid_score, reason="ok")

    def test_overall_verdict_invalid_score(self) -> None:
        with pytest.raises(ValidationError):
            OverallVerdict(score=0, decision="No", confidence="Low", summary="s")

    def test_overall_verdict_score_too_high(self) -> None:
        with pytest.raises(ValidationError):
            OverallVerdict(score=6, decision="No", confidence="Low", summary="s")
