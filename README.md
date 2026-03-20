# DesignEval

システム設計面接をAIが自動評価するWebアプリ + CLIツール。

## Webアプリ

### 技術スタック

- **フロントエンド/バックエンド**: Next.js 16 (App Router)
- **認証 + DB**: Supabase (Google/GitHub OAuth + PostgreSQL)
- **AI評価**: Claude API (Anthropic)

### クイックスタート（ローカル開発）

```bash
cd web
cp .env.local.example .env.local
# .env.local を編集してSupabaseとAnthropicのキーを設定
npm install
npm run dev
```

### Supabase設定

1. [supabase.com](https://supabase.com) でプロジェクトを作成
2. Authentication > Providers で Google と GitHub を有効化
3. SQL Editor で `web/supabase/migrations/001_initial.sql` の内容を貼り付けて実行
4. Project Settings > API から URL と anon key をコピーし `.env.local` に設定

### 環境変数

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
```

### Vercelデプロイ

1. GitHubにプッシュ
2. [Vercel](https://vercel.com) でリポジトリをインポート
3. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
4. Root Directory を `web` に設定
5. デプロイ
6. Supabase の Authentication > URL Configuration > Redirect URLs に Vercel の URL を追加

### 機能

- Google/GitHub ログイン
- 設計問題と回答の入力フォーム
- 12観点のスコアリング + レーダーチャート
- Markdown/JSONレポートのダウンロード
- 評価履歴の管理

### 利用制限

- ユーザーあたり月5回の評価

---

## CLI

CLIはOpenAI APIを使用（Webアプリとは異なるLLMプロバイダー）。

### セットアップ

```bash
pip install -e ".[dev]"
```

### 使い方

```bash
export OPENAI_API_KEY="sk-..."

# ファイル出力
design-eval samples/problem_url_shortener.md samples/answer_url_shortener.md -o output/

# 標準出力
design-eval samples/problem_url_shortener.md samples/answer_url_shortener.md --stdout

# モデル指定
design-eval problem.md answer.md -m gpt-4o-mini
```

---

## プロジェクト構成

```
DesignEval/
├── src/design_eval/          # Python CLI (OpenAI API)
│   ├── cli.py
│   ├── evaluator.py
│   ├── models.py
│   └── output.py
├── prompts/
│   └── system_prompt.md      # 評価プロンプト（CLI・Web共有）
├── web/                      # Next.js Webアプリ (Claude API)
│   ├── src/
│   │   ├── app/              # ページ・APIルート
│   │   ├── lib/              # 評価ロジック・Supabase
│   │   └── components/       # UIコンポーネント
│   └── supabase/migrations/  # DBスキーマ
├── samples/                  # サンプル問題・回答・出力
└── pyproject.toml
```

## カスタマイズ

- **評価基準**: `prompts/system_prompt.md` を編集（CLI・Web両方に反映）
- **LLMモデル**: CLIは `--model` オプションで指定
