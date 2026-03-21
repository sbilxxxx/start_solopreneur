/**
 * manager-agent — 自律プロジェクトマネージャー
 *
 * 毎日9時にTask Schedulerから実行される。
 * 実行: node scripts/agents/run-manager.mjs
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { SUBAGENTS } from "./subagents.mjs";
import { sendLine } from "../lib/notify.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const today = new Date().toLocaleDateString("ja-JP", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const MANAGER_PROMPT = `あなたはソロアントレプレナープロジェクトの自律プロジェクトマネージャーです。
今日は ${today} です。

## 必ず実行すること（この順番で）

### 1. 状況把握
- tasks/current.md のPhase 4 TODOを確認する
- marketing/sns/ の最新ファイルで投稿ストック残数を確認する（🔲の数）
- content/drafts/ に未完成記事があるか確認する
- git log --oneline --since="24 hours ago" で昨日からの変更を確認する

### 2. 実行判断（優先順位順）

**優先度 高:**
- 投稿ストックが2本以下 → marketing-agent に「3本補充して」と依頼
- content/drafts/ に記事あり → editorial-agent に完成を依頼 → seo-checker → content-reviewer

**優先度 中:**
- tasks/current.md の🔲DEVタスクで安全なもの（UI修正・設定追加・バグ修正） → dev-agent に依頼

**人間の判断が必要（GitHub Issue作成 + LINE通知）:**
- 記事をcontent/blog/に移動（本番公開）
- 新しい外部API・サービスの導入
- 実行すべき明確なタスクがない場合（現状報告のみ）

Issueを作成したら必ず以下を実行する:
  node scripts/lib/notify.mjs "【承認待ち】[タスク内容] → Issue #番号 を確認してください: https://github.com/sbilxxxx/start_solopreneur/issues/番号 ✅close=承認 / 💬コメント=却下"

**前回作成した承認待ちIssueの確認:**
- gh issue list --repo sbilxxxx/start_solopreneur --label "承認待ち" --state closed で承認済みを確認
- 承認済みタスクがあれば今日の実行計画に追加する

### 3. 実行ログ記録
今日の日付で logs/manager-YYYY-MM-DD.md を作成し、実行内容・判断理由・結果を記録する。

## 制約
- 自分の判断で本番デプロイ・課金・外部サービスへの直接操作はしない
- 1回の実行で対応するタスクは最大2件まで（過負荷防止）
- 判断に迷ったらIssueを作成して人間に委ねる
`;

async function main() {
  console.log(`[Manager] 起動: ${today}`);
  console.log("[Manager] プロジェクト状況を確認中...\n");

  for await (const message of query({
    prompt: MANAGER_PROMPT,
    options: {
      cwd: process.cwd(),
      allowedTools: ["Read", "Write", "Glob", "Grep", "Bash", "Agent"],
      permissionMode: "acceptEdits",
      maxTurns: 80,
      maxBudgetUsd: 2.0,
      agents: SUBAGENTS,
    },
  })) {
    if (message.type === "system" && message.subtype === "init") {
      console.log(`[Manager] セッションID: ${message.session_id}`);
    }
    if ("result" in message) {
      console.log("\n[Manager] 完了:");
      console.log(message.result);

      // 実行結果にIssue作成が含まれる場合、念のため通知
      if (
        message.result.includes("Issue") &&
        message.result.includes("承認")
      ) {
        await sendLine(
          `\n【Manager Agent 完了】\n${message.result.slice(0, 200)}`
        );
      }
    }
  }
}

main().catch((err) => {
  console.error("[Manager] エラー:", err);
  process.exit(1);
});
