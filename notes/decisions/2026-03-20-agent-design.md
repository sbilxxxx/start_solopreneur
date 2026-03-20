# エージェント設計 — 一人会社のAIチーム構成

作成日: 2026-03-20

このプロジェクトは「AIエージェントが各部門を担う一人会社」として設計されている。
このドキュメントは、各エージェントの役割・責務・連携方法を定義する。

---

## 設計思想

- **Skills（手順書）** = メイン会話内で動く。手順・ルールの定義。
- **Agents（独立ワーカー）** = 独立したコンテキストで動く。実際の作業を担当。
- **ユーザー** = 社長。判断・承認・手動作業のみ行う。

```
社長（ユーザー）
    ↓ 方針・判断
manager-agent（プロジェクトマネージャー）
    ↓ タスク委任・スケジュール管理
    ├── editorial-agent   コンテンツ制作
    ├── marketing-agent   X投稿・マーケ実行
    ├── dev-agent         開発・実装
    ├── content-reviewer  品質評価
    └── seo-checker       SEO技術検証
```

---

## Agents 一覧

### manager-agent（プロジェクトマネージャー）

| 項目 | 内容 |
|------|------|
| **責務** | プロジェクト全体の状況把握・優先順位付け・各Agentへの委任・スケジュール管理 |
| **管理対象** | `tasks/current.md`・`marketing/sns/`・`notes/decisions/2026-03-20-content-roadmap.md` |
| **ツール** | Read, Glob, Grep, Bash（git log・ls のみ）|
| **しないこと** | コードを書く・記事を書く・投稿を実行する |

**使い方:** 「状況を整理して」「スケジュールを確認して」

---

### editorial-agent（編集長）

| 項目 | 内容 |
|------|------|
| **責務** | ブログ記事のリサーチ・執筆計画管理・記事執筆 |
| **管理対象** | `content/blog/`・`content/drafts/`・`notes/decisions/2026-03-20-content-roadmap.md` |
| **ツール** | WebSearch, WebFetch, Read, Write, Glob, Grep |
| **フロー** | リサーチ → 構成案 → 執筆 → `seo-checker` / `content-reviewer` に渡す |

**使い方:** 「〜について記事を書いて」「コンテンツ計画を立てて」

---

### marketing-agent（マーケ担当）

| 項目 | 内容 |
|------|------|
| **責務** | X投稿の実行・ストック管理・効果記録 |
| **管理対象** | `marketing/sns/`・`marketing/strategy/` |
| **ツール** | Read, Write, Glob, Grep, Bash |
| **自動化** | `scripts/schedule-tweet.mjs` で日付指定投稿を実行 |
| **しないこと** | 戦略の判断（manager-agentに委ねる）|

**使い方:** 「今日の投稿を出して」「投稿ストックを確認して」

---

### dev-agent（開発エンジニア）

| 項目 | 内容 |
|------|------|
| **責務** | Next.js/TypeScript/Tailwind での実装・修正・デバッグ |
| **管理対象** | `src/` 以下すべて |
| **ツール** | Read, Write, Edit, Glob, Grep, Bash（全ツール）|
| **規約** | `CLAUDE.md` のコーディング方針に従う |

**使い方:** 「〜を実装して」「バグを直して」

---

### content-reviewer（コンテンツレビュアー）

| 項目 | 内容 |
|------|------|
| **責務** | 記事・サイト・X投稿・マーケ戦略を読者目線で評価 |
| **ツール** | Read, Glob, Grep, WebFetch（読み取りのみ）|
| **ペルソナ** | A: ブログ読者 / B: Xフォロワー / C: サイト初回訪問者 |
| **しないこと** | コンテンツの修正（評価・提案のみ）|

**使い方:** 「この記事をレビューして」「サイト全体を評価して」

---

### seo-checker（SEOチェッカー）

| 項目 | 内容 |
|------|------|
| **責務** | 記事のSEO技術検証（メタデータ・見出し・キーワード・内部リンク）|
| **ツール** | Read, Glob, Grep（読み取りのみ）|
| **しないこと** | ファイルを書き換える・内容の評価 |

**使い方:** 「この記事のSEOをチェックして」

---

## Skills 一覧

Skillsはメイン会話内で動く手順書。Agentsとの使い分けは以下の通り。

| Skill | 役割 | Agent との違い |
|-------|------|--------------|
| `/write-post` | 記事執筆の手順書 | `editorial-agent` が内包しているため通常は不要 |
| `/marketing-post` | X投稿文生成の手順書 | `marketing-agent` が内包しているため通常は不要 |
| `/analyze-finance` | 財務分析の手順書 | 財務専用Agentがないため引き続き有効 |

---

## 典型的なワークフロー

### ① 記事を書いて公開するまで

```
manager-agent でスケジュール確認
    ↓
editorial-agent でリサーチ + 執筆
    ↓
seo-checker で技術検証
    ↓
content-reviewer で読者評価
    ↓
（修正があれば editorial-agent に差し戻し）
    ↓
content/blog/ に移動 → デプロイ
    ↓
marketing-agent で X投稿文を生成 → ストックに追加
```

### ② X投稿を自動実行するまで

```
marketing-agent が起動
    ↓
node scripts/schedule-tweet.mjs --dry-run で確認
    ↓
node scripts/schedule-tweet.mjs で実行
    ↓
marketing/sns/YYYY-MM.md が自動更新（アーカイブ化）
```

### ③ 開発タスクをこなすまで

```
manager-agent でタスク確認・優先順位付け
    ↓
dev-agent で実装
    ↓
npm run build で確認
    ↓
content-reviewer で UI/UX評価（必要な場合）
```

---

## ファイル構成

```
.claude/
  skills/
    write-post.md          記事執筆の手順書
    marketing-post.md      X投稿文生成の手順書
    analyze-finance.md     財務分析の手順書
  agents/
    manager-agent.md       プロジェクトマネージャー
    editorial-agent.md     編集長（リサーチ・計画・執筆）
    marketing-agent.md     マーケ担当（X投稿・自動化）
    dev-agent.md           開発エンジニア
    content-reviewer.md    コンテンツレビュアー
    seo-checker.md         SEOチェッカー

scripts/
  tweet.mjs                単発投稿スクリプト
  schedule-tweet.mjs       スケジュール自動投稿スクリプト
```
