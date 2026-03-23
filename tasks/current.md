# 現在のスプリント — Phase 5

最終更新: 2026-03-23

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

## TODO（優先順）

---

### 【1】手動作業（自分でやること）

Claude Code では完結しない操作。

- [x] X アイコン・ヘッダー画像を設定（Xアプリ → プロフィール編集）
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

### 【2】コンテンツ品質改善

- [ ] **サイト全体のコンテンツを初心者目線で抜本的に見直し・修正**
  - 対象: ブログ記事・トップページ・各セクションの説明文
  - 方針: 前提知識を減らし、専門用語に補足を追加、読者が「自分ごと」として捉えられる書き方に統一

---

### 【3】記事執筆

**記事の公開状態は `content/blog/` の実ファイルが正。**
詳細計画 → `notes/decisions/2026-03-20-content-roadmap.md`

#### Phase 5 システム構成理解シリーズ

- [x] **記事①「AIエージェントで一人会社を動かす仕組み、全部見せます」** — 公開済み
- [ ] **記事②「GitHub Actionsとは何か——PCがないと動かないを卒業した話」**
  - 内容: 仕組みの説明 + Task Scheduler → GitHub Actions 移行の実録
- [ ] **記事③「自律化システムを作ってわかった3つの落とし穴」**
  - 前提: 文字化け修正・二重実行防止・構造化ログの安定化対応完了後
- [ ] **記事④「ログを構造化したら、何が見えるようになったか」**
  - 前提: 構造化ログ（logs/runs/*.json）実装完了後

#### 時期依存

- [ ] ソロアントレ1ヶ月目レポート（4月末）
- [ ] フォロワー0からのX運用記録（1ヶ月分たまったら）
- [ ] Subagentsで分業した話（実装後）

---

### 【4】開発（Phase 5 自律化）

- [x] チャットUI — ChatWidget は layout.tsx に組み込み済み、`/api/chat/route.ts` 実装済み
- [ ] **editorial pipeline テスト**（`npm run agents:editorial "トピック名"`）

---

### 【5】クロス発信 + 英語対応

- [x] クロス発信システム開発（`scripts/crosspost/`、`npm run crosspost <slug>`、GitHub Actions自動実行）
- [ ] **クロス発信の有効化** — GitHub Secrets に `QIITA_TOKEN` / `MEDIUM_TOKEN` / `ZENN_GITHUB_REPO` を登録
- [ ] **英語対応**
  - 既存記事の英語版生成（翻訳パイプライン拡張）
  - Medium向け英語記事の自動投稿
  - サイト自体のi18n対応（ja/en切り替え）検討

---

### 【6】マーケ運用（自動化済み）

X投稿は GitHub Actions (`tweet-schedule.yml`) で自動実行（月8時/水12時/金19時 JST）。

- X投稿の状態 → `marketing/sns/YYYY-MM.md` を確認（正の情報源）
- ストック残数が2本以下になったら `marketing-agent` に補充を依頼

---

## 参照ドキュメント

| 目的 | ファイル |
|------|---------|
| Phase 4・5 完了アーカイブ | `tasks/backlog/phase-4-6.md` |
| コスト最適化設計 | `notes/decisions/2026-03-22-cost-design.md` |
| コンテンツ執筆計画 | `notes/decisions/2026-03-20-content-roadmap.md` |
| 開発実行ロードマップ | `notes/decisions/2026-03-20-execution-roadmap.md` |
| エージェント設計 | `notes/decisions/2026-03-20-agent-design.md` |
| X投稿ストック・実行ログ | `marketing/sns/2026-03.md` |
| X戦略 | `marketing/strategy/x-strategy.md` |
