# 現在のスプリント — Phase 5

最終更新: 2026-03-21

---

## マイルストーン全体像

```
Phase 1 ✅  基礎構築
Phase 2 ✅  会社組織化 + コンテンツ基盤 + X連携
Phase 3 ✅  マーケ運用 + SEO計測基盤 + 開発拡張
Phase 4 ✅  AI機能実装（Anthropic SDK・チャット・RAG）
Phase 5 🔄  高度自動化（Plugins・Agent Teams・自律化）  ← 今ここ
Phase 6 🔲  収益化 + 資金管理
```

---

## 情報の正の情報源

このファイルは**開発・手動作業タスク専用**。他の情報は以下を参照すること。

| 情報 | 正の情報源 |
|------|---------|
| X投稿の実行状態 | `marketing/sns/YYYY-MM.md` のアーカイブ欄 |
| 記事の公開状態 | `content/blog/` の実ファイル存在 |
| 記事の執筆計画 | `notes/decisions/2026-03-20-content-roadmap.md` |
| エージェント設計 | `notes/decisions/2026-03-20-agent-design.md` |

---

## Phase 4 の全TODO（優先順）

---

### 【A】手動作業（自分でやること）

Claude Code では完結しない操作。

- [ ] X アイコン・ヘッダー画像を設定（Xアプリ → プロフィール編集）
- [ ] URL制限が解除されたら固定ツイートをURL付きで再投稿
- [ ] Zenn に engineering 記事をクロスポスト（1本目: `how-to-start-claude-code`）

---

### 【B】マーケ運用

X投稿は Windows Task Scheduler + `scripts/schedule-tweet.mjs` で自動実行。
**個別の投稿状態はこのファイルで管理しない。**

- X投稿の状態 → `marketing/sns/YYYY-MM.md` のアーカイブ欄を確認（正の情報源）
- ストック残数が2本以下になったら `marketing-agent` に補充を依頼

---

### 【D】開発（優先順）

- [x] **Anthropic SDK 導入**（src/lib/anthropic.ts）
- [x] **記事自動要約**（/api/summarize）
- [x] **サイト内チャット機能**（/api/chat + ChatWidget）
- [x] **RAG**（src/lib/rag.ts — Claude Haikuで関連記事選択、チャットに自動注入）

---

### 【E】Claude Code 拡張機能（Phase 3 持越し）

- [x] **日英自動翻訳パイプライン**
  - `scripts/translate-post.mjs <slug>` で titleEn/summaryEn を自動生成
  - editorial pipeline 完了後に自動実行
  - `npm run translate <slug>` で単体実行も可能
- [x] **記事公開 → Telegram通知 Hook**
  - `content/blog/` に Write → `scripts/hooks/on-blog-write.mjs` → Telegram通知
  - settings.local.json の PostToolUse hook に登録済み
- [x] **Subagents 実践**
  - scripts/agents/ に run-manager / run-editorial / run-marketing 実装済み
  - `npm run agents:editorial "トピック"` で editorial→seo→reviewer パイプライン動作
- [x] **MCP 実践**（GitHub MCP）
  - .mcp.json に github MCP サーバー設定済み
  - manager-agent が `mcp__github__*` でIssue作成・確認できる
  - Task Scheduler `SoloPreneur\Manager-Agent` を毎日9時に登録済み

---

### 【G】Phase 5 — 自律化（新規）

**セットアップ（手動）:**
- [ ] **ANTHROPIC_API_KEY を .env.local に設定**
- [ ] **Telegram Bot セットアップ**
  1. Telegramで `@BotFather` に `/newbot` → `TELEGRAM_BOT_TOKEN` 取得
  2. ボットにメッセージ送信 → `https://api.telegram.org/bot{TOKEN}/getUpdates` で `TELEGRAM_CHAT_ID` 取得
  3. ランダム文字列を `TELEGRAM_WEBHOOK_SECRET` に設定
  4. `npm run telegram:test` で通知確認
  5. Vercelにデプロイ後 `npm run telegram:setup` でWebhook登録

**動作確認:**
- [x] **Telegram通知テスト**: `npm run telegram:test`
- [x] **Telegram Webhook登録**: `npm run telegram:setup`
- [ ] **チャットUI動作確認**（`npm run dev` → localhost:3000）
- [x] **manager-agent 初回テスト実行**（`npm run agents:manager`）
- [ ] **editorial pipeline テスト**（`npm run agents:editorial "トピック名"`）

---

### 【F】コンテンツ（時期依存）

**記事の公開状態は `content/blog/` の実ファイルが正。このファイルでは管理しない。**
執筆計画の詳細 → `notes/decisions/2026-03-20-content-roadmap.md`

- [ ] ソロアントレ1ヶ月目レポート（4月末）
- [ ] フォロワー0からのX運用記録（1ヶ月分たまったら）
- [ ] Subagentsで分業した話（Subagents実装後）

---

## 参照ドキュメント

| 目的 | ファイル |
|------|---------|
| Phase 3 アーカイブ | `tasks/phase-3.md` |
| コンテンツ執筆計画 | `notes/decisions/2026-03-20-content-roadmap.md` |
| 開発実行ロードマップ | `notes/decisions/2026-03-20-execution-roadmap.md` |
| Claude Code 習得ロードマップ | `notes/decisions/2026-03-20-claudecode-learning-roadmap.md` |
| エージェント設計 | `notes/decisions/2026-03-20-agent-design.md` |
| X投稿ストック・実行ログ | `marketing/sns/2026-03.md` |
| X戦略 | `marketing/strategy/x-strategy.md` |
