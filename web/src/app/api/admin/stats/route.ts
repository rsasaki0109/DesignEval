import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";

function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!adminEmails.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createServiceClient();
  const db = admin ?? supabase;

  // Total evaluations
  const { count: totalEvaluations } = await db
    .from("evaluations")
    .select("id", { count: "exact", head: true });

  // Evaluations this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: evaluationsThisMonth } = await db
    .from("evaluations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", firstDayOfMonth);

  // Unique users
  const { data: usersData } = await db
    .from("evaluations")
    .select("user_id");

  const uniqueUsers = new Set(usersData?.map((r) => r.user_id)).size;

  // Average score
  const { data: scoresData } = await db
    .from("evaluations")
    .select("average_score");

  let avgScore = 0;
  if (scoresData && scoresData.length > 0) {
    const sum = scoresData.reduce((acc, r) => acc + Number(r.average_score), 0);
    avgScore = Math.round((sum / scoresData.length) * 10) / 10;
  }

  return NextResponse.json({
    total_evaluations: totalEvaluations ?? 0,
    evaluations_this_month: evaluationsThisMonth ?? 0,
    unique_users: uniqueUsers,
    avg_score: avgScore,
  });
}
