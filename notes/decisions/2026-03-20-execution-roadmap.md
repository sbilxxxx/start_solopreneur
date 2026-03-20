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
| 3 | マーケ運用 + 外部連携 + 自動化基盤 | 🔄 進行中 |
| 4 | AI機能実装（SDK・チャット・RAG） | 🔲 |
| 5 | 高度自動化（Plugins・スケジュール） | 🔲 |
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

### Phase 3 🔄

**完了済み:**
- ✅ Google Analytics 導入（GA4 / G-42LR3VS3FL）
- ✅ OGP タグ・サイトマップ（SEO 基盤）
- ✅ GitHub MCP セットアップ（.mcp.json + Token）
- ✅ KPI ダッシュボード（/dashboard・/api/kpi）
- ✅ X投稿スケジュール自動化（scripts/schedule-tweet.mjs + Task Scheduler）
- ✅ プロジェクト自動監視（scripts/monitor.mjs + Task Scheduler 毎日9時）
- ✅ AIエージェント組織設計（.claude/agents/ 6体）

**残タスク:**
- 🔲 Webhook（記事公開 → X 投稿文ドラフト自動生成）
- 🔲 Subagents 実践（editorial-agent × marketing-agent パイプライン）
- 🔲 MCP 実践（GitHub Issues・PR を Claude Code から操作）

### Phase 4 🔲
- Anthropic SDK 導入（src/lib/anthropic.ts）
- 記事自動要約（/api/summarize）
- サイト内チャット機能（/api/chat + ChatWidget）
- RAG（ブログ記事のナレッジベース化 + ベクトル検索）
- 日英自動翻訳パイプライン

### Phase 5 🔲
- コンテンツ自動生成パイプライン
- Slack / Discord 通知連携
- i18n 完成（next-intl・日英切り替え UI）
- Agent Teams 実験

### Phase 6 🔲
- Stripe 決済（有料記事・サブスクリプション）
- Resend ニュースレター
- 収益ダッシュボード（finance/ 連携）

---

## コンテンツ執筆ロードマップ

→ `notes/decisions/2026-03-20-content-roadmap.md` に独立。
フェーズ別の記事タイトル・進捗・クロスポスト計画・ネタ帳はそちらを参照。
