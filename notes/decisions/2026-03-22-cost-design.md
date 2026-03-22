# コスト設計 — 月$50予算の管理方針

作成日: 2026-03-22

---

## 問題

2026-03-21 に1日で $2.64 消費（月換算 ~$79）。
月予算 $50 を大幅に超えるペース。

### 消費内訳（2026-03-21）

| エージェント | 回数 | 単価 | 合計 |
|------------|------|------|------|
| instruction | 15回 | $0.15 | $2.25 |
| manager | 3回 | $0.13 | $0.39 |
| **合計** | | | **$2.64** |

instruction が多い理由: Telegram からの試行錯誤・デバッグ指示が集中した。

---

## 対策（2026-03-22 実施）

### Step 1: モデル切り替え

| エージェント | 変更前 | 変更後 | 効果 |
|------------|--------|--------|------|
| manager-agent | Sonnet（デフォルト）| Haiku | ~70% コスト削減 |
| instruction [simple] | Sonnet | Haiku | ~70% コスト削減 |
| instruction [medium/complex] | Sonnet | Sonnet（維持） | — |
| editorial-agent | Sonnet | Sonnet（維持） | — |

### Step 2: 実行頻度削減

- **manager cron**: 毎日 → 平日のみ（月〜金）→ 月31回→22回（▲30%）
- **manager maxTurns**: 30 → 15（最悪ケースのコスト半減）

### Step 3: pre-check（LLMスキップ）

manager-agent 起動時、AIを呼ぶ前にファイルとGitHub APIを確認:
- タスクなし + open Manager Issue なし → LLM呼び出しなしで終了
- 節約効果: 何もない日は $0.03（statusOnly）ではなく $0 に

### Step 4: 予算上限の自動停止

| 閾値 | アクション |
|------|---------|
| $40/月（80%）| manager: Telegram警告 + LLM呼び出しスキップ |
| $45/月（90%）| instruction: Telegram警告 + Issue をスキップしてclose |

---

## 月次コスト試算（最適化後）

### 楽観シナリオ（指示少ない月）

| 項目 | 頻度 | 単価 | 月額 |
|------|------|------|------|
| manager（pre-checkスキップ） | 22回中15回スキップ | $0 | $0 |
| manager（LLM実行） | 7回 | ~$0.05 | ~$0.35 |
| instruction medium | 10回/月 | $0.15 | $1.50 |
| instruction simple | 5回/月 | ~$0.04（Haiku） | $0.20 |
| **合計** | | | **~$2.05** |

### 悲観シナリオ（試行錯誤が多い月）

| 項目 | 頻度 | 単価 | 月額 |
|------|------|------|------|
| manager | 22回 | ~$0.05 | ~$1.10 |
| instruction | 20回/月 | ~$0.10 avg | $2.00 |
| editorial（記事執筆） | 2回/月 | $0.50 | $1.00 |
| **合計** | | | **~$4.10** |

→ 月$50予算に対して十分な余裕あり。

---

## 今後の課題

- **構造化ログ（logs/runs/*.json）**: 現在は `cost-log.json` への手動記録。実際のトークン数からの正確なコスト計算に移行したい。
- **Haiku の品質確認**: manager・instruction simple の品質が Haiku で十分かどうか、数週間の運用で確認する。

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `scripts/agents/run-manager.mjs` | Haiku モデル / maxTurns 30→15 / pre-check / $40停止 |
| `scripts/agents/run-instruction.mjs` | simple→Haiku / $45停止 |
| `.github/workflows/run-manager.yml` | cron: 毎日→平日のみ |
