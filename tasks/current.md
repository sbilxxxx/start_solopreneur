# 現在のスプリント — Phase 3

最終更新: 2026-03-20

---

## マイルストーン全体像

```
Phase 1 ✅  基礎構築
Phase 2 ✅  会社組織化 + コンテンツ基盤 + X連携
Phase 3 🔄  マーケ運用 + SEO計測基盤 + 開発拡張  ← 今ここ
Phase 4 🔲  AI機能実装（Agent Teams・チャット・RAG）
Phase 5 🔲  高度自動化（Plugins・スケジュール実行）
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

## Phase 3 の全TODO（優先順）

---

### 【A】手動作業（自分でやること）

Claude Code では完結しない操作。

- [x] X テスト投稿を削除 ✅
- [x] 固定ポストをピン留め ✅
- [ ] X アイコン・ヘッダー画像を設定（Xアプリ → プロフィール編集）
- [ ] URL制限が解除されたら固定ツイートをURL付きで再投稿

---

### 【B】マーケ運用（自動化済み）

X投稿は Windows Task Scheduler + `scripts/schedule-tweet.mjs` で自動実行。
**個別の投稿状態はこのファイルで管理しない。**

- X投稿の状態 → `marketing/sns/2026-03.md` のアーカイブ欄を確認（正の情報源）
- ストック残数が2本以下になったら `marketing-agent` に補充を依頼
- [ ] Zenn に engineering 記事をクロスポスト（1本目: `how-to-start-claude-code`）

---

### 【C】SEO・計測基盤

- [x] **OGP タグ設定** ✅
- [x] **サイトマップ生成** ✅
- [x] **Google Analytics 導入** ✅（GA4 / G-42LR3VS3FL）

---

### 【D】開発（優先順）

- [x] **GitHub MCP セットアップ** ✅
- [x] **KPI ダッシュボード**（`/dashboard`）✅
- [ ] **Webhook 実装**
  - 記事公開 → X 投稿文ドラフト自動生成
  - 前提: APIルート（`src/app/api/`）実装済み ✅（/api/kpi で達成）

---

### 【E】Claude Code 拡張機能

- [ ] **Subagents 実践**
  - `editorial-agent` × `marketing-agent` のパイプラインを動かす
- [ ] **MCP 実践**（GitHub MCP セットアップ後）
  - Issue 作成・PR マージを Claude Code から操作してみる

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
| コンテンツ執筆計画 | `notes/decisions/2026-03-20-content-roadmap.md` |
| 開発実行ロードマップ | `notes/decisions/2026-03-20-execution-roadmap.md` |
| Claude Code 習得ロードマップ | `notes/decisions/2026-03-20-claudecode-learning-roadmap.md` |
| エージェント設計 | `notes/decisions/2026-03-20-agent-design.md` |
| X投稿ストック・実行ログ | `marketing/sns/2026-03.md` |
| X戦略 | `marketing/strategy/x-strategy.md` |
