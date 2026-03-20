"""CLI entry point for DesignEval."""

from __future__ import annotations

import sys
from pathlib import Path

import click

from .evaluator import evaluate
from .models import EvaluationInput
from .output import to_json, to_markdown


@click.command()
@click.argument("problem_file", type=click.Path(exists=True, path_type=Path))
@click.argument("answer_file", type=click.Path(exists=True, path_type=Path))
@click.option(
    "-o",
    "--output-dir",
    type=click.Path(path_type=Path),
    default=None,
    help="Output directory for report files. Defaults to current directory.",
)
@click.option(
    "-m",
    "--model",
    default="gpt-4o",
    show_default=True,
    help="LLM model to use for evaluation.",
)
@click.option(
    "--api-key",
    envvar="OPENAI_API_KEY",
    help="OpenAI API key. Defaults to OPENAI_API_KEY env var.",
)
@click.option(
    "--stdout",
    "to_stdout",
    is_flag=True,
    help="Print markdown report to stdout instead of writing files.",
)
def main(
    problem_file: Path,
    answer_file: Path,
    output_dir: Path | None,
    model: str,
    api_key: str | None,
    to_stdout: bool,
) -> None:
    """Evaluate a system design answer.

    PROBLEM_FILE: Path to the design problem description (text/markdown).
    ANSWER_FILE: Path to the candidate's answer (text/markdown).
    """
    if not api_key:
        click.echo("Error: OPENAI_API_KEY is required (env var or --api-key)", err=True)
        sys.exit(1)

    problem = problem_file.read_text(encoding="utf-8")
    answer = answer_file.read_text(encoding="utf-8")

    eval_input = EvaluationInput(problem=problem, answer=answer)

    click.echo(f"Evaluating with model: {model} ...")

    try:
        result = evaluate(eval_input, model=model, api_key=api_key)
    except Exception as e:
        click.echo(f"Error during evaluation: {e}", err=True)
        sys.exit(1)

    md_report = to_markdown(result)
    json_report = to_json(result)

    if to_stdout:
        click.echo(md_report)
        return

    out = output_dir or Path(".")
    out.mkdir(parents=True, exist_ok=True)

    stem = problem_file.stem
    md_path = out / f"{stem}_report.md"
    json_path = out / f"{stem}_result.json"

    md_path.write_text(md_report, encoding="utf-8")
    json_path.write_text(json_report, encoding="utf-8")

    click.echo(f"Markdown report: {md_path}")
    click.echo(f"JSON result:     {json_path}")
    click.echo(f"Average score:   {result.average_score():.1f}/5")
    click.echo(f"Verdict:         {result.overall.decision}")


if __name__ == "__main__":
    main()
