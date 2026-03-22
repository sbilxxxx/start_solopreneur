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

## Phase 5 の全TODO（優先順）

---

### 【A】手動作業（自分でやること）

Claude Code では完結しない操作。

- [ ] X アイコン・ヘッダー画像を設定（Xアプリ → プロフィール編集）
- [ ] URL制限が解除されたら固定ツイートをURL付きで再投稿
- [ ] Zenn に engineering 記事をクロスポスト（1本目: `how-to-start-claude-code`）
- [ ] ANTHROPIC_API_KEY を .env.local に設定（未設定なら）
- [ ] Telegram Bot セットアップ（未設定なら）
  1. `@BotFather` に `/newbot` → `TELEGRAM_BOT_TOKEN` 取得
  2. ボットにメッセージ送信 → getUpdates で `TELEGRAM_CHAT_ID` 取得
  3. ランダム文字列を `TELEGRAM_WEBHOOK_SECRET` に設定
  4. `npm run telegram:test` で通知確認
  5. Vercelにデプロイ後 `npm run telegram:setup` でWebhook登録

---

### 【B】マーケ運用

X投稿は Windows Task Scheduler + `scripts/schedule-tweet.mjs` で自動実行。
**個別の投稿状態はこのファイルで管理しない。**

- X投稿の状態 → `marketing/sns/YYYY-MM.md` のアーカイブ欄を確認（正の情報源）
- ストック残数が2本以下になったら `marketing-agent` に補充を依頼

---

### 【G】Phase 5 — 自律化（開発）

- [ ] **チャットUI動作確認**（`npm run dev` → localhost:3000）
- [ ] **editorial pipeline テスト**（`npm run agents:editorial "トピック名"`）

---

### 【H】クロスコンテンツ発信 + 英語対応（新規）

- [x] **クロス発信システム開発**
  - `scripts/crosspost/` にQiita/Medium/Zenn対応スクリプト実装済み
  - `npm run crosspost <slug>` で一括投稿可能
  - 新記事push時にGitHub Actionsで自動実行（`.github/workflows/crosspost.yml`）
  - **次のステップ:** GitHub SecretsにQIITA_TOKEN/MEDIUM_TOKEN/ZENN_GITHUB_REPO等を登録
- [ ] **英語対応**
  - 既存9記事の英語版生成（翻訳パイプライン拡張）
  - Medium向け英語記事の自動投稿
  - サイト自体のi18n対応（ja/en切り替え）検討

---

### 【F】コンテンツ（時期依存）

**記事の公開状態は `content/blog/` の実ファイルが正。このファイルでは管理しない。**
執筆計画の詳細 → `notes/decisions/2026-03-20-content-roadmap.md`

- [ ] ソロアントレ1ヶ月目レポート（4月末）
- [ ] フォロワー0からのX運用記録（1ヶ月分たまったら）
- [ ] Subagentsで分業した話（実装後）

---

## 参照ドキュメント

| 目的 | ファイル |
|------|---------|
| Phase 4 アーカイブ | `tasks/backlog/phase-4-6.md` |
| コンテンツ執筆計画 | `notes/decisions/2026-03-20-content-roadmap.md` |
| 開発実行ロードマップ | `notes/decisions/2026-03-20-execution-roadmap.md` |
| エージェント設計 | `notes/decisions/2026-03-20-agent-design.md` |
| X投稿ストック・実行ログ | `marketing/sns/2026-03.md` |
| X戦略 | `marketing/strategy/x-strategy.md` |
