import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const FREE_MONTHLY_LIMIT = 5;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("id, problem, average_score, decision, model, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  // Count evaluations for current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: monthlyCount } = await supabase
    .from("evaluations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id ?? "")
    .gte("created_at", firstDayOfMonth);

  const usedCount = monthlyCount ?? 0;

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        今月の使用回数: {usedCount} / {FREE_MONTHLY_LIMIT}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">評価履歴</h1>
        <Link
          href="/evaluate"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          新規評価
        </Link>
      </div>

      {!evaluations?.length ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">まだ評価がありません</p>
          <Link href="/evaluate" className="text-blue-600 hover:underline">
            最初の評価を実行する
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 font-medium">問題</th>
                <th className="text-left px-4 py-3 font-medium">スコア</th>
                <th className="text-left px-4 py-3 font-medium">判定</th>
                <th className="text-left px-4 py-3 font-medium">モデル</th>
                <th className="text-left px-4 py-3 font-medium">日時</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {evaluations.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <Link href={`/results/${ev.id}`} className="text-blue-600 hover:underline">
                      {ev.problem.slice(0, 60)}
                      {ev.problem.length > 60 && "..."}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono">{ev.average_score}/5</td>
                  <td className="px-4 py-3">{ev.decision}</td>
                  <td className="px-4 py-3 text-gray-500">{ev.model}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(ev.created_at).toLocaleDateString("ja-JP")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
