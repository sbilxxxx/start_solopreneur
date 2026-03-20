# Claude Code 習得ロードマップ

作成日: 2026-03-20
役割: Claude Code の拡張機能をどの順番で・なぜその順番で学ぶかを記録する。
     開発タスクやコンテンツ計画は `roadmap-all.md` に書く。

---

## 設計原則

> 拡張機能はフェーズではなく、各フェーズの土台として組み込む。
> 「作りながら覚える」— サイトの機能追加と学習が常に連動する。

旧ロードマップでは拡張機能をすべてPhase 5以降に配置していた。
これを各フェーズに前倒しすることで、早期から実践的に習得できる。

---

## 拡張機能の習得順序

| 拡張機能 | 習得フェーズ | 状態 | 一言説明 |
|---------|-----------|------|---------|
| **CLAUDE.md** | Phase 1 | ✅ | 毎回自動読込されるルールファイル。AIに文脈を永続的に持たせる |
| **Hooks** | Phase 1 | ✅ | イベント発生時に自動実行されるスクリプト。繰り返し作業をなくす |
| **Skills** | Phase 2 | ✅ | 呼び出し可能なワークフロー定義。部門長を `/コマンド` で呼び出す |
| **MCP** | Phase 3 | 🔲 | GitHub・Figma などの外部ツール操作権限を Claude に渡す |
| **Subagents** | Phase 3 | 🔲 | 独立したコンテキストで動く専門ワーカー。並列処理・委任が可能 |
| **Agent Teams** | Phase 4 | 🔲 | 複数の Claude セッションが協調して動く（実験的機能） |
| **Plugins** | Phase 5 | 🔲 | 機能をバンドルして再利用・配布できる仕組み |

---

## 各フェーズで習得すること

### Phase 1 ✅ — 基礎 + CLAUDE.md + Hooks

- Claude Code の基本操作（会話でファイルを操作する感覚）
- **CLAUDE.md**: 永続ルール・全セッション自動読み込み・部門別指示書の設計
- **Hooks**: Stopフック → 自動git push（イベント駆動の自動化の起点）
- Vercel デプロイ・GitHub 連携の仕組み

### Phase 2 ✅ — 会社組織化 + Skills

- **Skills**: AIに役割を与える設計（`/write-post` `/analyze-finance` `/marketing-post`）
- 部門別 CLAUDE.md（全社方針 vs 部門指示書の分離）
- MDX ブログ（Next.js App Router + gray-matter + remark-gfm）
- X API v2（OAuth 1.0a・投稿スクリプト）

### Phase 3 🔲 — MCP + Subagents

- **MCP（GitHub）**: 外部ツールの操作権限を Claude に渡す仕組み
  - 実装例: GitHub Issues・PR の作成・マージを Claude が直接操作
- **Subagents**: 独立コンテキストで動く専門ワーカー
  - 実装例: リサーチAgent → 執筆Agent → SEOチェックAgent のパイプライン
  - Subagents + Skills の組み合わせパターン
- Webhook 設計（イベント駆動の外部連携）

### Phase 4 🔲 — Anthropic SDK + Agent Teams

- **Agent Teams**: 複数セッションの並列協調（実験的機能）
  - 実装例: 日英翻訳の並列生成・複数専門エージェントの協調
- Anthropic SDK（ストリーミング・tool use）
- RAG（自分のブログ記事をナレッジベース化）
- ベクトル検索の基礎

### Phase 5 🔲 — Plugins + 高度な自動化

- **Plugins**: 機能のバンドル化・再利用・Marketplace 公開
  - 実装例: コンテンツ生成セットを自作プラグイン化
- 高度な Hooks（複数イベントの連鎖）
- スケジュール実行・バックグラウンド処理

---

## 旧ロードマップとの差分（設計変更の記録）

| 拡張機能 | 旧配置 | 新配置 | 変更理由 |
|---------|--------|--------|---------|
| CLAUDE.md | Phase 5 | Phase 1 | 最初から文脈管理が必要 |
| Hooks | Phase 6 | Phase 1 | 自動デプロイで即座に実感できる |
| Skills | Phase 5 | Phase 2 | 組織設計と同時に習得できる |
| Subagents | Phase 5 | Phase 3 | データ連携と組み合わせると効果的 |
| Agent Teams | Phase 5 | Phase 4 | SDK習得後に実験するほうが理解しやすい |
| Plugins | Phase 5 | Phase 5 | 据え置き（習得難度が高い） |
| フェーズ数 | 7 | 6 | 収益化を1フェーズに統合 |
