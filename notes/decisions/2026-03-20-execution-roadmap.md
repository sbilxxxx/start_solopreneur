# 実行ロードマップ（開発・コンテンツ）

作成日: 2026-03-20
役割: 各フェーズで何を作り・何を書くかの実行計画。進捗を随時更新する。
     Claude Code 習得順序は `roadmap-redesign.md` に書く。

---

## フェーズ進捗

| Phase | テーマ | 状態 |
|-------|--------|------|
| 1 | 基礎構築 | ✅ 完了 |
| 2 | 会社組織化 + コンテンツ基盤 + X連携 | ✅ 完了 |
| 3 | マーケ運用 + 外部連携 + Subagents | 🔄 進行中 |
| 4 | AI機能実装 + Agent Teams | 🔲 |
| 5 | 高度自動化 + Plugins | 🔲 |
| 6 | 収益化 + 資金管理 | 🔲 |

---

## 開発ロードマップ

サイト機能の実装順序。

### Phase 1 ✅
- Next.js 15 App Router + Tailwind CSS セットアップ
- ホームページ・About ページ
- Vercel 自動デプロイ（Stop フック）

### Phase 2 ✅
- ブログ機能（MDX・一覧・記事詳細）
- ホームページ・About ページ UX 改善
- Nav / Footer 共通コンポーネント
- X API 連携スクリプト（scripts/tweet.mjs）

### Phase 3 🔲
- Google Analytics 導入（PV 計測開始）
- OGP・サイトマップ（SEO 基盤）
- KPI ダッシュボード（/dashboard）
- API ルート実装（src/app/api/）
- Webhook（記事公開 → X 投稿文ドラフト自動生成）

### Phase 4 🔲
- サイト内チャット機能（Anthropic SDK）
- 記事自動要約
- RAG（自分のブログ記事をナレッジベース化）
- 日英自動翻訳パイプライン

### Phase 5 🔲
- コンテンツ自動生成パイプライン
- Slack / Discord 通知連携
- i18n 完成（next-intl・日英切り替え UI）

### Phase 6 🔲
- Stripe 決済（有料記事・サブスクリプション）
- Resend ニュースレター
- 収益ダッシュボード（finance/ 連携）

---

## コンテンツ執筆ロードマップ

→ **`notes/decisions/2026-03-20-content-roadmap.md` に独立。**
フェーズ別の記事タイトル・進捗・クロスポスト計画・ネタ帳はそちらを参照。

---

## 次のアクション（Phase 3 開始）

**手動作業（今すぐ）**
1. X テスト投稿削除（ID: 2034952592577765408 / 2034952755257962816）
2. 固定ポストをピン留め（Xアプリで設定）
3. X アイコン・ヘッダー画像設定（手動のみ可）
4. URL制限が解除されたら固定ツイートをURL付きで再投稿

**マーケ運用（下書き済み、あとは投稿するだけ）**
5. X 週3投稿ルーティン開始（月・水・金 — `marketing/sns/2026-03.md`）
6. Zenn クロスポスト開始

**技術**
7. Google Analytics 導入
8. GitHub MCP セットアップ（Personal Access Token が必要）
9. Subagents 入門
