"""Core evaluation logic using LLM."""

from __future__ import annotations

import json
from pathlib import Path

from openai import OpenAI

from .models import EvaluationInput, EvaluationResult

PROMPTS_DIR = Path(__file__).resolve().parent.parent.parent / "prompts"


def load_system_prompt() -> str:
    """Load the system prompt from the prompts directory."""
    prompt_path = PROMPTS_DIR / "system_prompt.md"
    return prompt_path.read_text(encoding="utf-8")


def build_user_message(evaluation_input: EvaluationInput) -> str:
    """Build the user message from problem and answer."""
    return (
        f"## 設計問題\n\n{evaluation_input.problem}\n\n"
        f"## 受験者の回答\n\n{evaluation_input.answer}"
    )


def evaluate(
    evaluation_input: EvaluationInput,
    *,
    model: str = "gpt-4o",
    api_key: str | None = None,
) -> EvaluationResult:
    """Run LLM evaluation and return structured result."""
    client = OpenAI(api_key=api_key)
    system_prompt = load_system_prompt()
    user_message = build_user_message(evaluation_input)

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content
    if content is None:
        raise RuntimeError("LLM returned empty response")

    data = json.loads(content)
    return EvaluationResult(**data)
