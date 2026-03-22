export interface ProblemTemplate {
  id: string;
  title: string;
  category: string; // "Web" | "インフラ" | "データ" | "ロボティクス"
  problem: string;
}

export const TEMPLATES: ProblemTemplate[] = [
  {
    id: "url-shortener",
    title: "URL短縮サービス",
    category: "Web",
    problem: `# URL短縮サービスの設計\n\n## 概要\nTinyURLやbit.lyのようなURL短縮サービスを設計してください。\n\n## 要件\n- 長いURLを短いURL（7文字程度）に変換\n- 短いURLにアクセスすると元のURLにリダイレクト\n- クリック統計の確認\n- 有効期限の設定\n\n## 規模\n- 月間1億URLの作成\n- 読み書き比率 100:1\n- 10年間保持`,
  },
  {
    id: "chat-system",
    title: "リアルタイムチャット",
    category: "Web",
    problem: `# リアルタイムチャットシステムの設計\n\n## 概要\nSlackやDiscordのようなリアルタイムチャットシステムを設計してください。\n\n## 要件\n- 1対1メッセージとグループチャット\n- メッセージの既読管理\n- ファイル共有\n- プッシュ通知\n- メッセージ検索\n\n## 規模\n- DAU 1000万人\n- 1人あたり1日50メッセージ\n- 99.99%可用性`,
  },
  {
    id: "notification",
    title: "通知システム",
    category: "インフラ",
    problem: `# 通知システムの設計\n\n## 概要\n大規模Webサービスの通知基盤を設計してください。\n\n## 要件\n- メール、SMS、プッシュ通知、アプリ内通知\n- テンプレート管理\n- 配信スケジューリング\n- ユーザーの通知設定（オプトイン/アウト）\n- 配信ログと分析\n\n## 規模\n- 1日1億通の通知\n- 5分以内の配信`,
  },
  {
    id: "newsfeed",
    title: "ニュースフィード",
    category: "データ",
    problem: `# ニュースフィードの設計\n\n## 概要\nTwitterやInstagramのようなニュースフィードを設計してください。\n\n## 要件\n- フォロー中のユーザーの投稿をタイムライン表示\n- 投稿のランキング/ソート\n- いいね・コメント\n- 無限スクロール\n\n## 規模\n- DAU 5000万人\n- 平均フォロー数 200人\n- p99レイテンシ 200ms以下`,
  },
  {
    id: "rate-limiter",
    title: "レートリミッター",
    category: "インフラ",
    problem: `# 分散レートリミッターの設計\n\n## 概要\nAPIゲートウェイ用の分散レートリミッターを設計してください。\n\n## 要件\n- ユーザー/IP/APIキー単位でのレート制限\n- 複数のアルゴリズム対応（Fixed Window, Sliding Window, Token Bucket）\n- 分散環境での正確なカウント\n- 低レイテンシ（1ms以下のオーバーヘッド）\n\n## 規模\n- 毎秒100万リクエスト\n- 10リージョン展開`,
  },
  {
    id: "autoware-perception",
    title: "自動運転 Perceptionパイプライン",
    category: "ロボティクス",
    problem: `# 自動運転 Perceptionパイプラインの設計\n\n## 概要\nL4自動運転車両の認識パイプラインを設計してください。\n\n## 要件\n- LiDAR, カメラ, レーダーのセンサフュージョン\n- 3D物体検出（車両、歩行者、自転車）\n- 物体追跡\n- フリースペース検出\n- 100ms以内のEnd-to-Endレイテンシ\n\n## 制約\n- 車載GPU (NVIDIA Orin相当)\n- ROS 2ベース\n- フェイルセーフ必須`,
  },
];
