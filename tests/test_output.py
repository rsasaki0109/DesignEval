"""Tests for design_eval.output."""

import json
from pathlib import Path

import pytest

from design_eval.models import EvaluationResult
from design_eval.output import to_json, to_markdown

SAMPLES_DIR = Path(__file__).resolve().parent.parent / "samples"


@pytest.fixture
def sample_result() -> EvaluationResult:
    """Load sample data into an EvaluationResult."""
    with open(SAMPLES_DIR / "example_output_result.json") as f:
        data = json.load(f)
    return EvaluationResult.model_validate(data)


class TestToMarkdown:
    """Test to_markdown produces valid output with expected sections."""

    def test_contains_title(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        assert "# DesignEval 評価レポート" in md

    def test_contains_all_sections(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        expected_sections = [
            "## 1. 問題の整理",
            "## 2. 設計内容の抽出",
            "## 3. 評価スコア",
            "## 4. 良かった点",
            "## 5. 弱い点・不足点",
            "## 6. トレードオフ分析",
            "## 7. 面接官向けの深掘り質問",
            "## 8. 改善提案",
            "## 9. 総合評価",
        ]
        for section in expected_sections:
            assert section in md, f"Missing section: {section}"

    def test_contains_score_table(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        assert "| 観点 | スコア | 理由 |" in md
        assert "|------|--------|------|" in md

    def test_contains_average_score(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        assert "平均スコア:" in md
        assert "/5" in md

    def test_contains_overall_verdict(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        assert "Lean Yes" in md
        assert "High" in md

    def test_contains_score_entries(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        for s in sample_result.scores:
            assert s.category in md

    def test_contains_improvements(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        for imp in sample_result.improvements:
            assert imp.what in md

    def test_output_is_string(self, sample_result: EvaluationResult) -> None:
        md = to_markdown(sample_result)
        assert isinstance(md, str)
        assert len(md) > 100


class TestToJson:
    """Test to_json produces valid JSON."""

    def test_produces_valid_json(self, sample_result: EvaluationResult) -> None:
        json_str = to_json(sample_result)
        parsed = json.loads(json_str)
        assert isinstance(parsed, dict)

    def test_roundtrip(self, sample_result: EvaluationResult) -> None:
        json_str = to_json(sample_result)
        parsed = json.loads(json_str)
        restored = EvaluationResult.model_validate(parsed)
        assert restored.overall.score == sample_result.overall.score
        assert len(restored.scores) == len(sample_result.scores)

    def test_contains_all_keys(self, sample_result: EvaluationResult) -> None:
        json_str = to_json(sample_result)
        parsed = json.loads(json_str)
        expected_keys = {
            "problem_summary",
            "design_extraction",
            "scores",
            "strengths",
            "weaknesses",
            "tradeoffs",
            "deep_dive_questions",
            "improvements",
            "overall",
        }
        assert set(parsed.keys()) == expected_keys

    def test_json_preserves_japanese(self, sample_result: EvaluationResult) -> None:
        json_str = to_json(sample_result)
        # ensure_ascii=False means Japanese characters should be present directly
        assert "URL" in json_str
        assert "設計" in json_str
