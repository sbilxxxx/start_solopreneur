# 現在のスプリント — Phase 3

最終更新: 2026-03-20（整理）

---

## マイルストーン全体像

```
Phase 1 ✅  基礎構築
Phase 2 ✅  会社組織化 + コンテンツ基盤 + X連携
Phase 3 🔄  マーケ運用 + SEO計測基盤 + Subagents  ← 今ここ
Phase 4 🔲  AI機能実装（Agent Teams・チャット・RAG）
Phase 5 🔲  高度自動化（Plugins・スケジュール実行）
Phase 6 🔲  収益化 + 資金管理
```

---

## Phase 3 の全TODO（優先順）

---

### 【A】手動作業（自分でやること・今すぐ）

Claude Code では完結しない操作。

- [ ] X テスト投稿を削除（ID: 2034952592577765408 / 2034952755257962816）
- [ ] 固定ポストをピン留め（Xアプリ → ポスト長押し → ピン留め）
- [ ] X アイコン・ヘッダー画像を設定（Xアプリ → プロフィール編集）
- [ ] URL制限が解除されたら固定ツイートをURL付きで再投稿

---

### 【B】マーケ運用（今すぐ開始できる）

下書き済み。あとは投稿するだけ。

- [ ] **3/23（月）気づき系ポスト**を投稿（`marketing/sns/2026-03.md` に下書き済み）
- [ ] **3/25（水）実録系ポスト**を投稿
- [ ] **3/27（金）ブログ誘導系ポスト**を投稿
- [ ] 投稿後に結果（いいね・RT・フォロワー数）を `marketing/sns/2026-03.md` に記録
- [ ] Zenn に engineering 記事をクロスポスト（1本目: `how-to-start-claude-code`）

---

### 【C】SEO・計測基盤（前半の優先タスク）

PVが計測できないと改善サイクルが回らない。

- [ ] **OGP タグ設定**（各ページに og:title / og:description / og:image）
  - SNSでシェアされたときにカード表示になる
- [ ] **サイトマップ生成**（`/sitemap.xml`）
  - Google がページを認識するために必要
- [ ] **Google Analytics 導入**（GA4）
  - GA4 プロパティ作成 → 測定ID（G-XXXXXXXX）を取得 → サイトに設置
  - *前提: Googleアカウントでプロパティを自分で作成する必要あり*

---

### 【D】外部連携・開発（中盤）

計測基盤が整ったあとに着手。

- [ ] **GitHub MCP セットアップ**
  - `.mcp.json` 設定ファイル ✅（最新コミットで追加済み）
  - GitHub で Personal Access Token を発行 → `.env.local` に `GITHUB_PERSONAL_ACCESS_TOKEN=xxx` を追加
  - *前提: GitHub Personal Access Token（repo権限）が必要*
- [ ] **KPI ダッシュボード**（`/dashboard` ページ）
  - GA4 から PV・フォロワー・コストを1画面で確認できる
  - *前提: Google Analytics 導入後*
- [ ] **Webhook 実装**
  - 記事公開 → X 投稿文ドラフト自動生成
  - *前提: APIルート実装後*

---

### 【E】Claude Code 拡張機能（後半）

Phase 3 の学習目標。

- [ ] **Subagents 入門**
  - リサーチ専用エージェントを1つ作る（ブログ記事のネタ収集など）
  - Subagents と Skills の組み合わせを試す
- [ ] **MCP 実践**（GitHub MCP セットアップ後）
  - Issue 作成・PR マージを Claude Code から操作してみる

---

### 【F】コンテンツ（Phase 3 中に書く）

実装したタイミングで書く。

- [ ] ソロアントレ1ヶ月目レポート（4月末）
- [ ] フォロワー0からのX運用記録（1ヶ月分たまったら）
- [x] MCPとは何か ✅（`content/blog/2026-03-20-what-is-mcp.mdx` 完成）
- [ ] Subagentsで分業した話（Subagents 実装後）

---

## 依存関係まとめ

```
【今すぐ】
  手動作業（A）
  X投稿ルーティン開始（B）
  Zennクロスポスト（B）

【今すぐ・並行】
  OGP・サイトマップ（C）← Claude Codeで実装できる

【要：Google Analytics ID】
  GA導入（C）→ KPIダッシュボード（D）

【要：GitHub Token】
  GitHub MCP（D）→ MCP実践（E）

【順番通りに】
  GA導入（C）→ Subagents入門（E）→ リサーチエージェント実装
```

---

## 参照ドキュメント

| 目的 | ファイル |
|------|---------|
| コンテンツ執筆ロードマップ | `notes/decisions/2026-03-20-content-roadmap.md` |
| 開発・実行ロードマップ | `notes/decisions/2026-03-20-roadmap-all.md` |
| Claude Code 習得ロードマップ | `notes/decisions/2026-03-20-roadmap-redesign.md` |
| X投稿ストック | `marketing/sns/2026-03.md` |
| X戦略 | `marketing/strategy/x-strategy.md` |
