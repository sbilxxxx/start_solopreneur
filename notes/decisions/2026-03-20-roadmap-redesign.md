# ロードマップ再設計

作成日: 2026-03-20
理由: Claude Code拡張機能は「Phase 5の応用」ではなく「各フェーズの土台」であることを認識。早期習得に向けて再設計。

---

## 設計原則

> 拡張機能はフェーズではなく、各フェーズに自然に組み込む。
> 「作りながら覚える」— サイトの機能追加と学習が常に連動する。

---

## 新ロードマップ

### Phase 1 ― 基礎 + CLAUDE.md + Hooks　← 今ここ（完了間近）

**Claude Code で学ぶ:**
- CLAUDE.md（永続ルール・全セッション自動読み込み）✅
- Hooks（Stopフック → 自動git push）✅

**サイト成果物:**
- ホームページ・Aboutページ ✅
- Vercel 自動デプロイ ✅
- notes/ tasks/ ディレクトリ ✅

---

### Phase 2 ― 会社組織化 + Skills + MCP

**Claude Code で学ぶ:**
- **Skills** — AIに役割を与える（`/write-post` `/analyze-finance`）
- **MCP** — 外部ツール操作権限（GitHub Issues・Figma）
- 各部門の `CLAUDE.md`（部門長への指示書）

**サイト成果物:**
- content/ marketing/ finance/ ディレクトリ（会社組織完成）
- ブログ機能（MDX）
- Nav/Footer 共通コンポーネント
- Projects ページ

---

### Phase 3 ― データ連携 + Subagents + 外部API

**Claude Code で学ぶ:**
- **Subagents** — 独立コンテキストで動く専門ワーカー
  - リサーチAgent → 執筆Agent → SEOチェックAgent
- Subagents + Skills の組み合わせ

**サイト成果物:**
- Google Analytics API 連携（PV自動取得）
- KPIダッシュボード（/dashboard）
- Webhook（記事公開 → SNS自動投稿）
- i18n 完成（日英切り替え）

---

### Phase 4 ― AI機能実装 + Agent Teams

**Claude Code で学ぶ:**
- **Agent Teams** — 複数セッションの並列協調（実験的機能）
- Anthropic SDK の実装パターン

**サイト成果物:**
- サイト内チャット・記事要約
- RAG（自分のブログをナレッジベースに）
- 日英自動翻訳パイプライン（Agent Teamsで並列生成）

---

### Phase 5 ― 自動化 + Plugins

**Claude Code で学ぶ:**
- **Plugins** — 機能をバンドルして再利用・配布
- 高度な Hooks（複数イベントの組み合わせ）
- Plugin Marketplace

**サイト成果物:**
- コンテンツ自動生成パイプライン（寝ている間も動く）
- 自作プラグイン（コンテンツ生成セット）
- Slack 通知

---

### Phase 6 ― 収益化

**サイト成果物:**
- Stripe API（有料コンテンツ・サブスク）
- Resend（ニュースレター）
- AI アナリティクス（PV → 改善提案の自動生成）

---

## 旧ロードマップとの差分

| 変更点 | 旧 | 新 |
|--------|----|----|
| CLAUDE.md | Phase 5 | Phase 1（✅ 完了） |
| Hooks | Phase 6 | Phase 1（✅ 完了） |
| Skills | Phase 5 | Phase 2（次） |
| Subagents | Phase 5 | Phase 3 |
| Agent Teams | Phase 5 | Phase 4 |
| Plugins | Phase 5 | Phase 5（据え置き） |
| フェーズ数 | 7 | 6（収益化を1つに統合） |
