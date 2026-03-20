# 現在のスプリント

最終更新: 2026-03-20

---

## マイルストーン全体像

```
Phase 1 ✅  基礎構築
Phase 2 ✅  会社組織化 + コンテンツ基盤 + X連携
Phase 3 🔲  マーケ運用 + 外部連携 + Subagents  ← 次
Phase 4 🔲  AI機能実装（Agent Teams・チャット・RAG）
Phase 5 🔲  高度自動化（Plugins・スケジュール実行）
Phase 6 🔲  収益化 + 資金管理
```

---

## ✅ Phase 1 完了

- [x] Next.js プロジェクト作成・Vercel デプロイ
- [x] GitHub 自動デプロイ（Stop フック）
- [x] ホームページ・About ページ
- [x] CLAUDE.md（全社方針）
- [x] notes/ tasks/ ディレクトリ・戦略ドキュメント

---

## ✅ Phase 2 完了

### 会社組織化
- [x] 会社組織ディレクトリ（content/ marketing/ finance/）
- [x] 各部門の CLAUDE.md
- [x] Skills（/write-post / /analyze-finance / /marketing-post）

### コンテンツ基盤
- [x] ブログ機能（MDX・一覧・記事詳細）
- [x] Nav / Footer 共通コンポーネント
- [x] ホームページ・About ページ UX改善
- [x] ブログ記事 6本執筆・書き直し
  - `2026-03-20-what-is-claude-code.mdx`（ChatGPTとの違い）
  - `2026-03-20-auto-deploy-hook.mdx`（自動デプロイ）
  - `2026-03-20-directory-as-company.mdx`（AIに役割を与える）
  - `2026-03-20-site-build-record.mdx`（サイト構築全記録）
  - `2026-03-20-claude-code-struggles.mdx`（詰まった5つのこと）
  - `2026-03-20-claude-md-design.mdx`（CLAUDE.md設計思想）

### X連携・ブランド
- [x] X API 連携（scripts/tweet.mjs）
- [x] X アカウント開設（@bensolopreneur）
- [x] X プロフィール設定（表示名・bio・URL）
- [x] 固定ツイート投稿（ID: 2034953081805553781）
- [x] ブランドパーソナリティ設計（けんすう型・LINEの本音スタイル）
- [x] UX・コンテンツ・マーケ戦略（事例調査7件込み）
- [x] X 週3投稿ストック作成（3/23・3/25・3/27分）

---

## 🔲 TODO（優先順）

### 手動作業（今すぐ）
- [ ] X テスト投稿を削除（ID: 2034952592577765408 / 2034952755257962816）
- [ ] 固定ポストをピン留め（Xアプリで設定）
- [ ] X アイコン・ヘッダー画像を設定（API不可のため手動）
- [ ] X URL制限が解除されたら固定ツイートを URL 付きで再投稿

### Phase 3: マーケ運用（コンテンツ配信開始）
- [ ] X 週3投稿ルーティン開始（月・水・金 — 下書き済み）
- [ ] Zenn へのクロスポスト開始（engineering記事から）
- [ ] Google Analytics 導入（PV 計測開始）

### Phase 3: 外部連携
- [ ] GitHub MCP セットアップ（Personal Access Token が必要）
- [ ] Subagents 入門（リサーチ専用エージェント作成）

---

## 参照ドキュメント

| 目的 | ファイル |
|------|---------|
| コンテンツ執筆ロードマップ | `notes/decisions/2026-03-20-content-roadmap.md` |
| 戦略全体 | `notes/decisions/2026-03-20-strategy-overview.md` |
| UX・コンテンツ・マーケ戦略 | `notes/decisions/2026-03-20-ux-content-marketing-strategy.md` |
| ブランドパーソナリティ | `notes/decisions/2026-03-20-brand-personality.md` |
| ロードマップ全体（4軸） | `notes/decisions/2026-03-20-roadmap-all.md` |
| X戦略 | `marketing/strategy/x-strategy.md` |
| コンテンツ戦略 | `marketing/strategy/content-pillars.md` |
| X投稿ストック | `marketing/sns/2026-03.md` |
