# URL短縮サービスの設計

## 前提の確認
- 月間1億URL作成 → 約40 URL/秒 (書き込み)
- 読み取りは100倍 → 約4,000リクエスト/秒 (リダイレクト)
- 10年で約120億URL → ストレージ計算の基礎

## 短縮キーの生成
Base62（a-z, A-Z, 0-9）で7文字 → 62^7 ≈ 3.5兆パターン。120億URLに対して十分。

生成方式として2つ検討:
1. **ハッシュ方式**: URLをMD5/SHA256でハッシュし先頭7文字。衝突時はリトライ。
2. **カウンター方式**: 分散IDジェネレーター（Snowflakeなど）でユニークIDを生成しBase62エンコード。

→ カウンター方式を採用。理由: 衝突なし、予測可能なパフォーマンス。ただしIDからURLの作成順序が推測可能というトレードオフあり。

## コンポーネント構成

### API Layer
- `POST /api/shorten` - URL作成
- `GET /:shortCode` - リダイレクト (301)
- `GET /api/stats/:shortCode` - 統計取得

Load Balancer (Nginx) → Application Servers (stateless, 水平スケール可能)

### データストア
- **Primary DB**: PostgreSQL
  - テーブル: `urls(id, short_code, original_url, user_id, created_at, expires_at)`
  - `short_code` にユニークインデックス
- **Cache**: Redis
  - リダイレクト高速化。short_code → original_url のマッピング
  - TTL付きで頻繁にアクセスされるURLをキャッシュ
  - キャッシュヒット率80%想定で、DB負荷を大幅削減

### ID生成サービス
- Snowflake風の分散IDジェネレーター
- 複数ワーカーで並列生成（worker_id で衝突回避）

## データフロー

### 書き込み (URL作成)
1. クライアント → LB → App Server
2. ID生成サービスからID取得
3. Base62エンコード → short_code
4. PostgreSQLに保存
5. Redisにもキャッシュ
6. short_code をクライアントに返却

### 読み取り (リダイレクト)
1. クライアント → LB → App Server
2. Redis でルックアップ → ヒットならリダイレクト
3. ミス → PostgreSQL検索 → Redisに書き戻し → リダイレクト
4. 非同期でクリックイベントをKafkaに送信

## スケーリング
- App Serverはステートレス → Auto Scaling Group
- PostgreSQLはRead Replicaで読み取り分散
- 将来的にはshort_codeの先頭文字でシャーディング
- Redisはクラスターモードで水平分散

## 統計機能
- クリックイベントはKafkaキューに非同期送信
- Consumer がクリックデータを集計DBに書き込み
- 統計APIは集計DBから読み取り

## 障害対応
- Redis障害時: DBフォールバック（レイテンシ増加は許容）
- DB障害時: Read Replicaへのフェイルオーバー
- ID生成障害時: 各App Serverにローカルバッファ（事前取得したIDレンジ）

## 考慮したトレードオフ
- **301 vs 302リダイレクト**: 301（永続）はブラウザキャッシュで速いが統計が取れなくなる。302を採用。
- **一貫性 vs 可用性**: 問題文にevential consistency可とあるので、Read Replicaの多少の遅延は許容。
- **カウンター vs ハッシュ**: 上述の通りカウンター採用。順序推測のリスクはあるがBase62エンコードで多少緩和。
