"""Core evaluation logic using LLM."""

from __future__ import annotations

import json
import re
from pathlib import Path

from openai import OpenAI

try:
    import anthropic as _anthropic_module

    _has_anthropic = True
except ImportError:
    _has_anthropic = False

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


def _extract_json(text: str) -> dict:
    """Extract JSON from text, handling markdown code blocks."""
    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code block
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        return json.loads(match.group(1))

    raise ValueError("Could not extract JSON from response")


def _evaluate_openai(
    evaluation_input: EvaluationInput,
    *,
    model: str = "gpt-4o",
    api_key: str | None = None,
) -> EvaluationResult:
    """Run evaluation using OpenAI API."""
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


def _evaluate_anthropic(
    evaluation_input: EvaluationInput,
    *,
    model: str = "claude-sonnet-4-20250514",
    api_key: str | None = None,
) -> EvaluationResult:
    """Run evaluation using Anthropic Claude API."""
    if not _has_anthropic:
        raise RuntimeError("anthropic package is not installed. Run: pip install anthropic")

    client = _anthropic_module.Anthropic(api_key=api_key)
    system_prompt = load_system_prompt()
    user_message = build_user_message(evaluation_input)

    # Claude doesn't support response_format=json_object, so instruct in the message
    user_message_with_json_instruction = (
        f"{user_message}\n\n"
        "重要: 回答は必ずJSON形式のみで返してください。マークダウンのコードブロックで囲んでも構いません。"
    )

    response = client.messages.create(
        model=model,
        max_tokens=4096,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message_with_json_instruction},
        ],
        temperature=0.3,
    )

    content = response.content[0].text
    if not content:
        raise RuntimeError("LLM returned empty response")

    data = _extract_json(content)
    return EvaluationResult(**data)


def evaluate(
    evaluation_input: EvaluationInput,
    *,
    model: str | None = None,
    api_key: str | None = None,
    provider: str = "openai",
) -> EvaluationResult:
    """Run LLM evaluation and return structured result.

    Args:
        evaluation_input: The problem and answer to evaluate.
        model: LLM model name. Defaults to provider-specific default.
        api_key: API key. Defaults to provider-specific env var.
        provider: "openai" or "anthropic".
    """
    if provider == "anthropic":
        return _evaluate_anthropic(
            evaluation_input,
            model=model or "claude-sonnet-4-20250514",
            api_key=api_key,
        )
    else:
        return _evaluate_openai(
            evaluation_input,
            model=model or "gpt-4o",
            api_key=api_key,
        )
