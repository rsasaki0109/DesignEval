import Link from "next/link";

const CATEGORIES = [
  { name: "要件理解", icon: "📋" },
  { name: "分解力（モジュール設計）", icon: "🧩" },
  { name: "抽象化・インターフェース設計", icon: "🔌" },
  { name: "データフロー・状態管理", icon: "🔄" },
  { name: "スケーラビリティ", icon: "📈" },
  { name: "信頼性・耐障害性", icon: "🛡" },
  { name: "パフォーマンス意識", icon: "⚡" },
  { name: "セキュリティ・安全性", icon: "🔒" },
  { name: "監視・保守性", icon: "🔧" },
  { name: "トレードオフ思考", icon: "⚖" },
  { name: "実現可能性", icon: "🏗" },
  { name: "伝達の明確さ", icon: "💬" },
];

const STEPS = [
  {
    step: "1",
    title: "ログイン",
    description: "Google or GitHubアカウントでログイン",
  },
  {
    step: "2",
    title: "問題と回答を入力",
    description: "設計問題と受験者の回答をテキストで入力",
  },
  {
    step: "3",
    title: "AIが評価",
    description: "12の観点でスコアリングされたレポートを自動生成",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          DesignEval
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          システム設計面接をAIが構造的に評価
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-lg">
          設計問題と回答を入力するだけで、12の観点からスコアリング。
          トレードオフ分析、改善提案、深掘り質問を自動生成します。
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            始める
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl text-left">
          <div>
            <h3 className="font-semibold mb-2">12の評価観点</h3>
            <p className="text-sm text-gray-500">
              要件理解、モジュール設計、スケーラビリティ、トレードオフ思考など、実務に即した観点で評価
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Claude AIが評価</h3>
            <p className="text-sm text-gray-500">
              Anthropic Claude が設計回答を分析。ログインするだけで利用可能、月5回まで無料
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">レポート自動生成</h3>
            <p className="text-sm text-gray-500">
              Markdownレポート、レーダーチャート、JSON結果をワンクリックでダウンロード
            </p>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="w-full max-w-4xl mt-16 mb-16">
        <h2 className="text-2xl font-bold text-center mb-10">使い方</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 12 Evaluation Categories */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-2xl font-bold text-center mb-4">
          12の評価カテゴリ
        </h2>
        <p className="text-center text-gray-500 mb-10">
          システム設計に必要なスキルを網羅的に評価します
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <p className="text-sm font-medium leading-tight">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="w-full max-w-4xl mb-20">
        <h2 className="text-2xl font-bold text-center mb-4">
          サンプルレポートを見る
        </h2>
        <p className="text-center text-gray-500 mb-8">
          実際の評価レポートのイメージです
        </p>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 space-y-6">
          {/* Mock verdict */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <p className="text-sm text-gray-500">総合判定</p>
              <p className="text-2xl font-bold text-green-600">Lean Yes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">平均スコア</p>
              <p className="text-2xl font-bold">3.6 / 5</p>
            </div>
          </div>

          {/* Mock scores */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-3">
              スコア一覧（例）
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "要件理解", score: 4 },
                { name: "モジュール設計", score: 3 },
                { name: "スケーラビリティ", score: 4 },
                { name: "トレードオフ思考", score: 4 },
                { name: "信頼性・耐障害性", score: 3 },
                { name: "伝達の明確さ", score: 4 },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-3 py-2"
                >
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                  <span className="font-semibold text-sm">
                    {item.score}/5
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
              <p className="font-medium text-green-700 dark:text-green-300 mb-2">
                強み
              </p>
              <ul className="text-green-600 dark:text-green-400 space-y-1 text-xs">
                <li>- 要件を正確に分解し、機能要件・非機能要件を区別</li>
                <li>- キャッシュ戦略のトレードオフを適切に議論</li>
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4">
              <p className="font-medium text-amber-700 dark:text-amber-300 mb-2">
                改善点
              </p>
              <ul className="text-amber-600 dark:text-amber-400 space-y-1 text-xs">
                <li>- 障害発生時のフォールバック戦略が未記述</li>
                <li>- 監視・アラート設計への言及が不足</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 pt-2">
            これはサンプルです。実際のレポートにはレーダーチャート、深掘り質問、改善提案も含まれます。
          </p>
        </div>
      </section>
    </div>
  );
}
