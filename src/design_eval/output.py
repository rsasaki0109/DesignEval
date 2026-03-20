"""Output formatting for evaluation results."""

from __future__ import annotations

import json

from .models import EvaluationResult


def to_json(result: EvaluationResult, *, indent: int = 2) -> str:
    """Convert result to JSON string."""
    return json.dumps(result.model_dump(), indent=indent, ensure_ascii=False)


def to_markdown(result: EvaluationResult) -> str:
    """Convert result to markdown report."""
    lines: list[str] = []

    lines.append("# DesignEval 評価レポート\n")

    # 1. Problem summary
    lines.append("## 1. 問題の整理\n")
    for item in result.problem_summary:
        lines.append(f"- {item}")
    lines.append("")

    # 2. Design extraction
    lines.append("## 2. 設計内容の抽出\n")
    for key, value in result.design_extraction.items():
        lines.append(f"### {key}\n")
        lines.append(f"{value}\n")

    # 3. Scores
    lines.append("## 3. 評価スコア\n")
    lines.append("| 観点 | スコア | 理由 |")
    lines.append("|------|--------|------|")
    for s in result.scores:
        lines.append(f"| {s.category} | {s.score}/5 | {s.reason} |")
    lines.append(f"\n**平均スコア: {result.average_score():.1f}/5**\n")

    # 4. Strengths
    lines.append("## 4. 良かった点\n")
    for item in result.strengths:
        lines.append(f"- {item}")
    lines.append("")

    # 5. Weaknesses
    lines.append("## 5. 弱い点・不足点\n")
    for item in result.weaknesses:
        lines.append(f"- {item}")
    lines.append("")

    # 6. Tradeoffs
    lines.append("## 6. トレードオフ分析\n")
    for t in result.tradeoffs:
        lines.append(f"### {t.dimension}\n")
        lines.append(f"{t.analysis}\n")

    # 7. Deep dive questions
    lines.append("## 7. 面接官向けの深掘り質問\n")
    for i, q in enumerate(result.deep_dive_questions, 1):
        lines.append(f"{i}. {q}")
    lines.append("")

    # 8. Improvements
    lines.append("## 8. 改善提案\n")
    for i, imp in enumerate(result.improvements, 1):
        lines.append(f"### 改善{i}: {imp.what}\n")
        lines.append(f"- **理由**: {imp.why}")
        lines.append(f"- **軽減するリスク**: {imp.risk_reduced}\n")

    # 9. Overall
    lines.append("## 9. 総合評価\n")
    lines.append(f"- **総合スコア**: {result.overall.score}/5")
    lines.append(f"- **判定**: {result.overall.decision}")
    lines.append(f"- **信頼度**: {result.overall.confidence}")
    lines.append(f"\n{result.overall.summary}\n")

    return "\n".join(lines)
