export type Locale = "ja" | "en";

const translations = {
  // Navigation
  "nav.newEvaluation": { ja: "新規評価", en: "New Evaluation" },
  "nav.compare": { ja: "比較", en: "Compare" },
  "nav.history": { ja: "履歴", en: "History" },
  "nav.logout": { ja: "ログアウト", en: "Logout" },
  "nav.login": { ja: "ログイン", en: "Login" },

  // Landing page - hero
  "landing.subtitle": {
    ja: "システム設計面接をAIが構造的に評価",
    en: "AI-powered structural evaluation for system design interviews",
  },
  "landing.description": {
    ja: "設計問題と回答を入力するだけで、12の観点からスコアリング。トレードオフ分析、改善提案、深掘り質問を自動生成します。",
    en: "Simply enter a design problem and answer to get scored across 12 dimensions. Trade-off analysis, improvement suggestions, and deep-dive questions are generated automatically.",
  },

  // Landing page - feature cards
  "landing.feature1.title": { ja: "12の評価観点", en: "12 Evaluation Dimensions" },
  "landing.feature1.description": {
    ja: "要件理解、モジュール設計、スケーラビリティ、トレードオフ思考など、実務に即した観点で評価",
    en: "Evaluated on practical dimensions including requirements understanding, module design, scalability, and trade-off reasoning",
  },
  "landing.feature2.title": { ja: "Claude AIが評価", en: "Evaluated by Claude AI" },
  "landing.feature2.description": {
    ja: "Anthropic Claude が設計回答を分析。ログインするだけで利用可能、月5回まで無料",
    en: "Anthropic Claude analyzes design answers. Just log in to use — up to 5 evaluations per month free",
  },
  "landing.feature3.title": { ja: "レポート自動生成", en: "Auto-generated Reports" },
  "landing.feature3.description": {
    ja: "Markdownレポート、レーダーチャート、JSON結果をワンクリックでダウンロード",
    en: "Download Markdown reports, radar charts, and JSON results with one click",
  },

  // Landing page - how to use
  "landing.howToUse": { ja: "使い方", en: "How to Use" },
  "landing.step1.title": { ja: "ログイン", en: "Log In" },
  "landing.step1.description": {
    ja: "Google or GitHubアカウントでログイン",
    en: "Log in with your Google or GitHub account",
  },
  "landing.step2.title": { ja: "問題と回答を入力", en: "Enter Problem & Answer" },
  "landing.step2.description": {
    ja: "設計問題と受験者の回答をテキストで入力",
    en: "Enter the design problem and the candidate's answer as text",
  },
  "landing.step3.title": { ja: "AIが評価", en: "AI Evaluates" },
  "landing.step3.description": {
    ja: "12の観点でスコアリングされたレポートを自動生成",
    en: "A report scored across 12 dimensions is automatically generated",
  },

  // Landing page - categories section
  "landing.categoriesTitle": { ja: "12の評価カテゴリ", en: "12 Evaluation Categories" },
  "landing.categoriesSubtitle": {
    ja: "システム設計に必要なスキルを網羅的に評価します",
    en: "Comprehensively evaluates the skills required for system design",
  },

  // Landing page - category names
  "landing.cat.requirements": { ja: "要件理解", en: "Requirements Understanding" },
  "landing.cat.decomposition": { ja: "分解力（モジュール設計）", en: "Decomposition (Module Design)" },
  "landing.cat.abstraction": { ja: "抽象化・インターフェース設計", en: "Abstraction & Interface Design" },
  "landing.cat.dataflow": { ja: "データフロー・状態管理", en: "Data Flow & State Management" },
  "landing.cat.scalability": { ja: "スケーラビリティ", en: "Scalability" },
  "landing.cat.reliability": { ja: "信頼性・耐障害性", en: "Reliability & Fault Tolerance" },
  "landing.cat.performance": { ja: "パフォーマンス意識", en: "Performance Awareness" },
  "landing.cat.security": { ja: "セキュリティ・安全性", en: "Security & Safety" },
  "landing.cat.observability": { ja: "監視・保守性", en: "Observability & Maintainability" },
  "landing.cat.tradeoff": { ja: "トレードオフ思考", en: "Trade-off Thinking" },
  "landing.cat.feasibility": { ja: "実現可能性", en: "Feasibility" },
  "landing.cat.communication": { ja: "伝達の明確さ", en: "Communication Clarity" },

  // Landing page - sample report
  "landing.sampleReport.title": { ja: "サンプルレポートを見る", en: "View Sample Report" },
  "landing.sampleReport.subtitle": {
    ja: "実際の評価レポートのイメージです",
    en: "Here is what an actual evaluation report looks like",
  },
  "landing.sampleReport.overallVerdict": { ja: "総合判定", en: "Overall Verdict" },
  "landing.sampleReport.averageScore": { ja: "平均スコア", en: "Average Score" },
  "landing.sampleReport.scoreList": { ja: "スコア一覧（例）", en: "Score List (Example)" },
  "landing.sampleReport.strengths": { ja: "強み", en: "Strengths" },
  "landing.sampleReport.improvements": { ja: "改善点", en: "Areas for Improvement" },
  "landing.sampleReport.strengthItem1": {
    ja: "- 要件を正確に分解し、機能要件・非機能要件を区別",
    en: "- Accurately decomposed requirements, distinguishing functional and non-functional",
  },
  "landing.sampleReport.strengthItem2": {
    ja: "- キャッシュ戦略のトレードオフを適切に議論",
    en: "- Properly discussed trade-offs of caching strategies",
  },
  "landing.sampleReport.improvementItem1": {
    ja: "- 障害発生時のフォールバック戦略が未記述",
    en: "- Fallback strategies for failure scenarios were not described",
  },
  "landing.sampleReport.improvementItem2": {
    ja: "- 監視・アラート設計への言及が不足",
    en: "- Insufficient mention of monitoring and alerting design",
  },
  "landing.sampleReport.note": {
    ja: "これはサンプルです。実際のレポートにはレーダーチャート、深掘り質問、改善提案も含まれます。",
    en: "This is a sample. Actual reports also include radar charts, deep-dive questions, and improvement suggestions.",
  },

  // Landing page - sample score names (short)
  "landing.sample.requirements": { ja: "要件理解", en: "Requirements" },
  "landing.sample.moduleDesign": { ja: "モジュール設計", en: "Module Design" },
  "landing.sample.scalability": { ja: "スケーラビリティ", en: "Scalability" },
  "landing.sample.tradeoff": { ja: "トレードオフ思考", en: "Trade-off" },
  "landing.sample.reliability": { ja: "信頼性・耐障害性", en: "Reliability" },
  "landing.sample.communication": { ja: "伝達の明確さ", en: "Communication" },

  // Evaluate page
  "evaluate.title": { ja: "新規評価", en: "New Evaluation" },
  "evaluate.templateLabel": { ja: "問題テンプレート", en: "Problem Template" },
  "evaluate.custom": { ja: "カスタム", en: "Custom" },
  "evaluate.problemLabel": { ja: "設計問題", en: "Design Problem" },
  "evaluate.problemPlaceholder": {
    ja: "例: URL短縮サービスを設計してください...",
    en: "e.g., Design a URL shortening service...",
  },
  "evaluate.answerLabel": { ja: "受験者の回答", en: "Candidate's Answer" },
  "evaluate.answerPlaceholder": {
    ja: "受験者の設計回答を貼り付けてください...",
    en: "Paste the candidate's design answer here...",
  },
  "evaluate.modelLabel": { ja: "モデル", en: "Model" },
  "evaluate.submit": { ja: "評価を実行", en: "Run Evaluation" },
  "evaluate.submitting": { ja: "評価中...", en: "Evaluating..." },
  "evaluate.errorDefault": { ja: "評価に失敗しました", en: "Evaluation failed" },
  "evaluate.errorNetwork": { ja: "通信エラーが発生しました", en: "A network error occurred" },
  "evaluate.progressWait": {
    ja: "通常15〜30秒かかります。このページを閉じないでください。",
    en: "This usually takes 15-30 seconds. Please do not close this page.",
  },
  "evaluate.progress1": { ja: "LLMに送信中...", en: "Sending to LLM..." },
  "evaluate.progress2": { ja: "設計を分析中...", en: "Analyzing design..." },
  "evaluate.progress3": { ja: "スコアを算出中...", en: "Calculating scores..." },
  "evaluate.progress4": { ja: "レポートを生成中...", en: "Generating report..." },

  // Compare page
  "compare.title": { ja: "回答比較", en: "Compare Answers" },
  "compare.problemLabel": { ja: "設計問題", en: "Design Problem" },
  "compare.problemPlaceholder": {
    ja: "例: URL短縮サービスを設計してください...",
    en: "e.g., Design a URL shortening service...",
  },
  "compare.answerA": { ja: "回答 A", en: "Answer A" },
  "compare.answerB": { ja: "回答 B", en: "Answer B" },
  "compare.answerAPlaceholder": {
    ja: "候補者Aの回答を貼り付けてください...",
    en: "Paste candidate A's answer here...",
  },
  "compare.answerBPlaceholder": {
    ja: "候補者Bの回答を貼り付けてください...",
    en: "Paste candidate B's answer here...",
  },
  "compare.modelLabel": { ja: "モデル", en: "Model" },
  "compare.submit": { ja: "比較を実行", en: "Run Comparison" },
  "compare.submitting": { ja: "比較中...", en: "Comparing..." },
  "compare.errorDefault": { ja: "評価に失敗しました", en: "Evaluation failed" },
  "compare.errorNetwork": { ja: "通信エラーが発生しました", en: "A network error occurred" },
  "compare.progressWait": {
    ja: "2つの回答を並列評価中です。通常30〜60秒かかります。",
    en: "Evaluating both answers in parallel. This usually takes 30-60 seconds.",
  },
  "compare.progress1": { ja: "LLMに送信中...", en: "Sending to LLM..." },
  "compare.progress2": { ja: "2つの回答を分析中...", en: "Analyzing both answers..." },
  "compare.progress3": { ja: "スコアを算出中...", en: "Calculating scores..." },
  "compare.progress4": { ja: "比較レポートを生成中...", en: "Generating comparison report..." },
  "compare.categoryScores": { ja: "カテゴリ別スコア比較", en: "Score Comparison by Category" },
  "compare.categoryHeader": { ja: "カテゴリ", en: "Category" },

  // Dashboard page
  "dashboard.title": { ja: "評価履歴", en: "Evaluation History" },
  "dashboard.monthlyUsage": { ja: "今月の使用回数", en: "Monthly usage" },
  "dashboard.newEvaluation": { ja: "新規評価", en: "New Evaluation" },
  "dashboard.empty": { ja: "まだ評価がありません", en: "No evaluations yet" },
  "dashboard.firstEvaluation": { ja: "最初の評価を実行する", en: "Run your first evaluation" },
  "dashboard.colProblem": { ja: "問題", en: "Problem" },
  "dashboard.colScore": { ja: "スコア", en: "Score" },
  "dashboard.colDecision": { ja: "判定", en: "Decision" },
  "dashboard.colModel": { ja: "モデル", en: "Model" },
  "dashboard.colDate": { ja: "日時", en: "Date" },

  // Results page
  "results.title": { ja: "評価結果", en: "Evaluation Result" },

  // Share page
  "share.publicNotice": {
    ja: "この評価結果は共有リンクで公開されています",
    en: "This evaluation result is shared via a public link",
  },
  "share.title": { ja: "評価結果", en: "Evaluation Result" },

  // EvaluationReport component
  "report.overallScore": { ja: "総合スコア", en: "Overall Score" },
  "report.average": { ja: "平均", en: "Average" },
  "report.confidence": { ja: "信頼度", en: "Confidence" },
  "report.scoreChart": { ja: "スコアチャート", en: "Score Chart" },
  "report.share": { ja: "共有", en: "Share" },
  "report.sharing": { ja: "共有中", en: "Sharing" },
  "report.shareProcessing": { ja: "処理中...", en: "Processing..." },
  "report.copy": { ja: "コピー", en: "Copy" },
  "report.copied": { ja: "コピー済み", en: "Copied" },

  // PdfButton
  "pdf.generating": { ja: "生成中...", en: "Generating..." },

  // Spinner
  "spinner.loading": { ja: "読み込み中", en: "Loading" },

  // Login page
  "login.title": { ja: "ログイン", en: "Login" },
  "login.google": { ja: "Googleでログイン", en: "Login with Google" },
  "login.github": { ja: "GitHubでログイン", en: "Login with GitHub" },

  // Common
  "common.getStarted": { ja: "始める", en: "Get Started" },
} as const;

export type TranslationKey = keyof typeof translations;

/**
 * Look up a translated string by key and locale.
 */
export function t(key: TranslationKey, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] ?? entry.ja;
}
