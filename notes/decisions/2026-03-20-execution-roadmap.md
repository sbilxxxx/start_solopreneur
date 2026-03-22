# 実行ロードマップ（開発）

作成日: 2026-03-20
役割: 各フェーズで何を実装するかの計画。進捗を随時更新する。
     Claude Code 習得順序は `claudecode-learning-roadmap.md` に書く。
     現在のスプリントのTODOは `tasks/current.md` に書く（こちらは計画のみ）。

---

## フェーズ進捗

| Phase | テーマ | 状態 |
|-------|--------|------|
| 1 | 基礎構築 | ✅ 完了 |
| 2 | 会社組織化 + コンテンツ基盤 + X連携 | ✅ 完了 |
| 3 | マーケ運用 + 外部連携 + 自動化基盤 | ✅ 完了 |
| 4 | AI機能実装（SDK・チャット・RAG） | ✅ 完了 |
| 5 | 高度自動化（Agent Teams・自律化・安定化） | 🔄 進行中 |
| 6 | 収益化 + 資金管理 | 🔲 |

---

## 開発ロードマップ

### Phase 1 ✅
- Next.js 15 App Router + Tailwind CSS セットアップ
- ホームページ・About ページ
- Vercel 自動デプロイ（Stop フック）

### Phase 2 ✅
- ブログ機能（MDX・一覧・記事詳細）
- ホームページ・About ページ UX 改善
- Nav / Footer 共通コンポーネント
- X API 連携スクリプト（scripts/tweet.mjs）

### Phase 3 ✅
- ✅ Google Analytics 導入（GA4 / G-42LR3VS3FL）
- ✅ OGP タグ・サイトマップ（SEO 基盤）
- ✅ GitHub MCP セットアップ（.mcp.json + Token）
- ✅ KPI ダッシュボード（/dashboard・/api/kpi）
- ✅ X投稿スケジュール自動化（scripts/schedule-tweet.mjs + Task Scheduler）
- ✅ プロジェクト自動監視（scripts/monitor.mjs + Task Scheduler 毎日9時）
- ✅ AIエージェント組織設計（.claude/agents/ 6体）
- ✅ Webhook（記事公開 → X 投稿文ドラフト自動生成）
- ✅ Subagents 実践（editorial-agent × marketing-agent パイプライン）
- ✅ MCP 実践（GitHub Issues・PR を Claude Code から操作）

### Phase 4 ✅
- ✅ Anthropic SDK 導入（src/lib/anthropic.ts）
- ✅ 記事自動要約（/api/summarize）
- ✅ サイト内チャット機能（/api/chat + ChatWidget）
- ✅ RAG（ブログ記事のナレッジベース化・LLMベース）
- ✅ 日英自動翻訳パイプライン
- ✅ クロスポストシステム（Qiita/Medium/Zenn）

### Phase 5 🔄 — 高度自動化 + システム安定化

**安定化（Codexレビューを受けて追加 — 2026-03-22）:**
- 🔲 文字化け全修正（UI文言・Telegram文言・プロンプト）※最優先
- 🔲 エージェント二重実行防止（ロックファイルまたは running ラベル付与）
- 🔲 外部API共通クライアント（`src/lib/clients/` にretry/timeout/error handling集約）
  - 対象: Anthropic / X / Telegram / GitHub
- 🔲 構造化ログ実装（`logs/runs/*.json` に run_id・duration_ms・estimated_cost・files_changed を記録）

**自律化:**
- 🔲 Agent Teams 実験（複数セッションの並列協調）
- 🔲 コンテンツ自動生成パイプライン
- 🔲 i18n 完成（next-intl・日英切り替え UI）

**RAG改善（記事が20本超えたら対応）:**
- 🔲 RAG埋め込み化（content/blog更新時にembedding生成 → ベクトル近傍検索）
  - 現在のLLMベースRAGは記事数増加で遅延・コスト増加が予測される

### Phase 6 🔲
- Stripe 決済（有料記事・サブスクリプション）
- Resend ニュースレター
- 収益ダッシュボード（finance/ 連携）

---

## コンテンツ執筆ロードマップ

→ `notes/decisions/2026-03-20-content-roadmap.md` に独立。
フェーズ別の記事タイトル・進捗・クロスポスト計画・ネタ帳はそちらを参照。
