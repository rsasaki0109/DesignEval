import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!adminEmails.includes(user.email ?? "")) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500">アクセス権限がありません</p>
      </div>
    );
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

  const { count: monthlyEvaluations } = await db
    .from("evaluations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", firstDayOfMonth);

  // Unique users
  const { data: uniqueUsersData } = await db
    .from("evaluations")
    .select("user_id");

  const uniqueUsers = new Set(uniqueUsersData?.map((r) => r.user_id)).size;

  // Recent evaluations across all users
  const { data: recentEvaluations } = await db
    .from("evaluations")
    .select("id, created_at, user_id, problem, average_score, decision, model")
    .order("created_at", { ascending: false })
    .limit(50);

  // Mask user_id as email-like display (first 3 chars + ***)
  function maskUser(userId: string): string {
    return userId.slice(0, 3) + "***";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">管理ダッシュボード</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
          <div className="text-sm text-gray-500">総評価数</div>
          <div className="text-3xl font-bold mt-1">{totalEvaluations ?? 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
          <div className="text-sm text-gray-500">今月の評価数</div>
          <div className="text-3xl font-bold mt-1">{monthlyEvaluations ?? 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
          <div className="text-sm text-gray-500">ユニークユーザー数</div>
          <div className="text-3xl font-bold mt-1">{uniqueUsers}</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">最近の評価（全ユーザー）</h2>

      {!recentEvaluations?.length ? (
        <p className="text-gray-500">評価データがありません</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 font-medium">日時</th>
                <th className="text-left px-4 py-3 font-medium">ユーザー</th>
                <th className="text-left px-4 py-3 font-medium">問題</th>
                <th className="text-left px-4 py-3 font-medium">スコア</th>
                <th className="text-left px-4 py-3 font-medium">判定</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentEvaluations.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(ev.created_at).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {maskUser(ev.user_id)}
                  </td>
                  <td className="px-4 py-3">
                    {ev.problem.slice(0, 60)}
                    {ev.problem.length > 60 && "..."}
                  </td>
                  <td className="px-4 py-3 font-mono">{ev.average_score}/5</td>
                  <td className="px-4 py-3">{ev.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
