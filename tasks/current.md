# 現在のスプリント — Phase 5

最終更新: 2026-03-22

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

X投稿は GitHub Actions (`tweet-schedule.yml`) で自動実行（月8時/水12時/金19時 JST）。
**個別の投稿状態はこのファイルで管理しない。**

- X投稿の状態 → `marketing/sns/YYYY-MM.md` のアーカイブ欄を確認（正の情報源）
- ストック残数が2本以下になったら `marketing-agent` に補充を依頼

---

### 【G】Phase 5 — 自律化（開発）

- [x] **チャットUI動作確認** — ChatWidget は layout.tsx に組み込み済み。APIルートも `/api/chat/route.ts` で実装済み。
- [ ] **editorial pipeline テスト**（`npm run agents:editorial "トピック名"`）

### 【K】Task Scheduler → GitHub Actions 移行 ✅

- [x] **tweet-schedule.yml 作成** — 月8時/水12時/金19時 JST に schedule-tweet.mjs を実行
- [x] **monitor.yml 作成** — 毎日8:30 JST に monitor.mjs を実行
- [x] **GitHub Secrets に X API キーを登録**（`X_API_KEY` / `X_API_SECRET` / `X_ACCESS_TOKEN` / `X_ACCESS_TOKEN_SECRET`）
- [x] **Windows Task Scheduler の旧タスク** — 既に存在しない（削除済み）

---

### 【J】コスト最適化（月$50予算設計）

**背景:** 1日$5超の消費が発生。月額$50を上限として設計を見直す。
**方針:** `notes/decisions/2026-03-22-cost-design.md` に詳細記録する。

#### Step 1: 消費元の特定（先決）
- [x] `logs/cost-log.json` を確認 — 2026-03-21: instruction×15=$2.25, manager×3=$0.39, 合計$2.64
- [x] GitHub Actions 実行履歴確認済み（logs/actions-log/ を参照）

#### Step 2: モデル切り替え（最大コスト削減効果）
- [x] **manager-agent を Haiku に変更**（`run-manager.mjs` に `model: "claude-haiku-4-5-20251001"` 追加）
- [x] **instruction [simple] を Haiku に変更**（`run-instruction.mjs` の `resolveSettings()` に `model` 追加）
- [x] editorial / instruction [complex] は Sonnet 維持

#### Step 3: 実行設計の見直し
- [x] **manager-agent を平日のみ実行に変更**（`run-manager.yml` の cron: `'0 0 * * 1-5'`）
- [x] **manager-agent のターン数を 30→15 に削減**
- [x] **pre-check 追加**: TODOが空 + Issueなし → LLMを呼ばず即終了

#### Step 4: 予算上限の設定
- [x] 月次コスト上限チェック実装済み（$40超過: manager停止 / $45超過: instruction停止 + Telegram警告）
- [x] 詳細設計を `notes/decisions/2026-03-22-cost-design.md` に記録

---

### 【I】システム構成理解シリーズ（記事執筆）

Phase 5の開発を進めながら、自分の理解整理も兼ねて書く。
詳細計画 → `notes/decisions/2026-03-20-content-roadmap.md` のPhase 5セクション

- [x] **記事①「AIエージェントで一人会社を動かす仕組み、全部見せます」** — `content/blog/2026-03-22-agent-system-overview.mdx` に公開済み
- [ ] **記事②「GitHub Actionsとは何か——PCがないと動かないを卒業した話」**
  - 前提: Task Scheduler → GitHub Actions 移行完了後
  - 内容: 仕組みの説明 + 移行の実録
- [ ] **記事③「自律化システムを作ってわかった3つの落とし穴」**
  - 前提: 文字化け修正・二重実行防止・構造化ログの安定化対応完了後
  - 内容: Codex指摘ベースの失敗談・教訓
- [ ] **記事④「ログを構造化したら、何が見えるようになったか」**
  - 前提: 構造化ログ（logs/runs/*.json）実装完了後

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
