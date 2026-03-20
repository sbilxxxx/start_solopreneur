# CLAUDE.md — 社長指示書

このファイルはClaude Codeが毎回自動で読み込む「全社方針」です。
AIエージェントはここに書いてあることを常に念頭に置いて動作します。

---

## このプロジェクトとは

AIエージェントが各部門を担う「一人会社」。
ソロアントレプレナーとしての活動（エンジニアリング・経営・財務・マーケ）を、
AIを使いこなしながら実践・発信するウェブサイト。

- **サイト:** https://start-solopreneur.vercel.app
- **X:** https://x.com/bensolopreneur（Ben｜Start Solopreneur）
- **リポジトリ:** github.com/sbilxxxx/start_solopreneur
- **詳細戦略:** notes/decisions/2026-03-20-project-strategy.md

---

## ディレクトリの役割

| ディレクトリ | 役割 |
|------------|------|
| `src/` | 開発部 — Next.jsアプリ本体 |
| `content/` | 編集部 — ブログ記事（MDX） |
| `marketing/` | 広報部 — 戦略・SNSテンプレ |
| `finance/` | 財務部 — 収益モデル・試算 |
| `notes/` | 社長メモ — アイデア・意思決定の記録 |
| `tasks/` | タスク管理 — スプリント・バックログ |
| `.claude/skills/` | 各部門エージェントのスキル定義 |

---

## 開発ルール

- フレームワーク: Next.js 15 App Router
- スタイル: Tailwind CSS（インラインclassNameで記述）
- 言語: TypeScript
- パッケージマネージャー: npm
- コミット: 日本語または英語、簡潔に

## コーディング方針

- コンポーネントは2ページ以上で使う場合のみ `src/components/` に切り出す
- 外部API・SDKの呼び出しは `src/lib/` に集約する
- 記事コンテンツは `content/blog/` のMDXファイルで管理する
- 環境変数は `.env.local`（gitignore済み）に記載する

## 禁止事項

- `npm` を `yarn` や `pnpm` に変えない
- `src/app/` 以外にページファイルを作らない
- APIキーをコードに直書きしない

---

## タスク管理

- **現在のスプリント:** `tasks/current.md` を参照
- **バックログ:** `tasks/backlog/phase-N.md` を参照
- **ロードマップ詳細:** `notes/decisions/2026-03-20-roadmap-redesign.md`

「次のタスクは？」と聞かれたら `tasks/current.md` の🔲TODOを確認すること。

## 現在の開発フェーズ

**Phase 1（完了）:** 基礎操作 + CLAUDE.md + Hooks
**Phase 2（進行中）:** 会社組織化 + Skills + MCP

フェーズ定義: `notes/decisions/2026-03-20-roadmap-redesign.md`
