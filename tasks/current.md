# 現在のスプリント — Phase 2

最終更新: 2026-03-20

---

## ✅ Phase 1 完了

- [x] Next.js プロジェクト作成・ローカル起動
- [x] Vercel デプロイ・GitHub 自動デプロイ（Stopフック）
- [x] ホームページ（会社組織図・6フェーズロードマップ）
- [x] About ページ
- [x] CLAUDE.md（全社方針・AI自動読込）
- [x] notes/（社長メモ）・tasks/（タスク管理）ディレクトリ
- [x] プロジェクト全体戦略ドキュメント・ロードマップ再設計

---

## ✅ Phase 2 完了済み

- [x] 会社組織ディレクトリ構築（content/ marketing/ finance/）
- [x] 各部門の CLAUDE.md（編集部・広報部・財務部のルール）
- [x] .claude/skills/ 作成（write-post / analyze-finance / marketing-post）

---

## 🔲 TODO — Phase 2 残タスク（優先順）

### ブログ機能（コンテンツ基盤）
- [ ] MDX 依存パッケージのインストール（`@next/mdx` など）
- [ ] ブログ一覧ページ（`/blog`）
- [ ] 記事詳細ページ（`/blog/[slug]`）
- [ ] サンプル記事を2〜3本作成（`/write-post` スキルを使う）

### 共通コンポーネント化
- [ ] `src/components/Nav.tsx`
- [ ] `src/components/Footer.tsx`
- [ ] 各ページに適用

### MCP（外部ツール連携）
- [ ] GitHub MCP セットアップ
- [ ] Issues・PRを会話で操作できるか確認
