import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluate } from "@/lib/evaluator";
import { averageScore } from "@/lib/models";
import { notifyEvaluationComplete } from "@/lib/webhook";

export const maxDuration = 60;

const FREE_MONTHLY_LIMIT = 5;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { problem, answer, model } = body;

  if (!problem || !answer) {
    return NextResponse.json(
      { error: "problem and answer are required" },
      { status: 400 }
    );
  }

  // Check monthly usage limit
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: monthlyCount, error: countError } = await supabase
    .from("evaluations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", firstDayOfMonth);

  if (countError) {
    console.error("Failed to check usage count:", countError);
  }

  const usedCount = monthlyCount ?? 0;

  if (usedCount >= FREE_MONTHLY_LIMIT) {
    return NextResponse.json(
      { error: `月間の評価上限（${FREE_MONTHLY_LIMIT}回）に達しました` },
      { status: 429 }
    );
  }

  try {
    const result = await evaluate({ problem, answer }, { model });

    // Save to database
    const { data: evaluation, error: insertError } = await supabase
      .from("evaluations")
      .insert({
        user_id: user.id,
        problem,
        answer,
        result,
        model: model || "claude-sonnet-4-20250514",
        average_score: averageScore(result).toFixed(1),
        decision: result.overall.decision,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to save evaluation:", insertError);
    }

    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      notifyEvaluationComplete(result, webhookUrl, problem).catch((err) => {
        console.error("Webhook notification failed:", err);
      });
    }

    const remaining = FREE_MONTHLY_LIMIT - usedCount - 1;

    return NextResponse.json({
      id: evaluation?.id,
      result,
      remaining,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
