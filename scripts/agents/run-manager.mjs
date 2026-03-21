/**
 * manager-agent — 自律プロジェクトマネージャー
 *
 * 毎日9時にTask Schedulerから実行される。
 * 実行: node scripts/agents/run-manager.mjs
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readdirSync, readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { SUBAGENTS, COST_ESTIMATES } from "./subagents.mjs";
import { sendTelegram } from "../lib/notify.mjs";
import { recordCost, getMonthlyTotal } from "../lib/cost-tracker.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const today = new Date().toLocaleDateString("ja-JP", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ─── Step1: AIを使わずにファイルを読むだけで状況を把握 ──────────────────────

function preflight() {
  const cwd = process.cwd();
  const tasks = [];

  // 投稿ストック確認
  try {
    const snsDir = resolve(cwd, "marketing/sns");
    const files = readdirSync(snsDir).filter((f) => f.endsWith(".md")).sort();
    if (files.length > 0) {
      const latest = readFileSync(resolve(snsDir, files[files.length - 1]), "utf-8");
      const pending = (latest.match(/^- 🔲/gm) || []).length;
      if (pending <= 2) {
        tasks.push({
          type: "marketing",
          label: `X投稿ストック補充（残${pending}本）`,
          estimateUsd: COST_ESTIMATES.marketing,
        });
      }
    }
  } catch { /* sns ディレクトリなし */ }

  // 下書き確認
  try {
    const draftsDir = resolve(cwd, "content/drafts");
    const drafts = readdirSync(draftsDir).filter((f) => f.endsWith(".mdx"));
    if (drafts.length > 0) {
      tasks.push({
        type: "editorial",
        label: `下書き仕上げ（${drafts.join(", ")}）`,
        estimateUsd: COST_ESTIMATES.editorial,
      });
    }
  } catch { /* drafts ディレクトリなし */ }

  // 直近24時間のgit活動
  let recentCommits = 0;
  try {
    const log = execSync('git log --oneline --since="24 hours ago"', {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    recentCommits = log ? log.split("\n").length : 0;
  } catch { /* git なし */ }

  return { tasks, recentCommits };
}

// ─── Step2: 事前通知（コスト見積もり付き） ──────────────────────────────────

async function sendPreflightNotice(tasks, recentCommits) {
  const { monthly, total } = getMonthlyTotal();

  let msg = `🌅 <b>Manager Agent 起動 — ${today}</b>\n\n`;
  msg += `💰 <b>API消費状況</b>\n`;
  msg += `　今月: $${monthly.toFixed(3)}\n`;
  msg += `　累計: $${total.toFixed(3)}\n\n`;

  if (tasks.length === 0) {
    msg += `📋 <b>本日のタスク</b>\nなし（状況確認のみ）\n`;
    msg += `　予測コスト: $${COST_ESTIMATES.statusOnly.toFixed(2)}\n`;
  } else {
    const totalEstimate = tasks.reduce((s, t) => s + t.estimateUsd, COST_ESTIMATES.statusOnly);
    msg += `📋 <b>本日のタスク（${tasks.length}件）</b>\n`;
    tasks.forEach((t) => {
      msg += `　• ${t.label}（約$${t.estimateUsd.toFixed(2)}）\n`;
    });
    msg += `\n予測合計: 約$${totalEstimate.toFixed(2)}\n`;
  }

  msg += `\n昨日のコミット: ${recentCommits}件`;

  await sendTelegram(msg, "HTML");
}

// ─── Step3: エージェント実行（必要なタスクのみ） ───────────────────────────

const MANAGER_PROMPT = `あなたはソロアントレプレナープロジェクトの自律プロジェクトマネージャーです。
今日は ${today} です。

## ルール（厳守）
- 1回の実行で対応するタスクは最大2件まで
- 自分の判断で本番公開・課金・外部サービス操作はしない
- 判断に迷ったらGitHub Issueを作成して人間に委ねる
- 不要なファイル読み込みは最小限にする

## 実行手順

### 1. 状況把握（必要最低限）
- tasks/current.md のTODOを確認
- marketing/sns/ の最新ファイルで投稿ストック残数を確認（🔲の数）
- content/drafts/ に未完成記事があるか確認

### 2. 実行判断（優先順位順）

**優先度 高:**
- 投稿ストックが2本以下 → marketing-agent に「3本補充して」と依頼
- content/drafts/ に記事あり → editorial-agent に完成を依頼

**人間の判断が必要（GitHub Issue作成 + Telegram通知）:**
- 記事をcontent/blog/に移動（本番公開）
- 新しい外部API・サービスの導入
- 実行すべき明確なタスクがない場合（現状報告のみ）

Issueを作成したら必ず:
  node scripts/lib/notify.mjs "【承認待ち】\\n[タスク内容]\\nhttps://github.com/sbilxxxx/start_solopreneur/issues/番号" --issue 番号

### 3. ログ記録
logs/manager-YYYY-MM-DD.md を作成し、実行内容と結果を簡潔に記録する（100行以内）。
`;

async function main() {
  console.log(`[Manager] 起動: ${today}`);

  // AIを使わず状況把握
  const { tasks, recentCommits } = preflight();
  console.log(`[Manager] 事前確認: タスク${tasks.length}件, 直近コミット${recentCommits}件`);

  // 事前通知
  await sendPreflightNotice(tasks, recentCommits);

  // エージェント実行
  console.log("[Manager] エージェント起動...\n");
  let budgetUsed = 0;

  for await (const message of query({
    prompt: MANAGER_PROMPT,
    options: {
      cwd: process.cwd(),
      allowedTools: ["Read", "Write", "Glob", "Grep", "Bash", "Agent"],
      permissionMode: "acceptEdits",
      maxTurns: 30,           // 80→30 に削減
      maxBudgetUsd: 0.8,      // 2.0→0.8 に削減
      agents: SUBAGENTS,
    },
  })) {
    if (message.type === "system" && message.subtype === "init") {
      console.log(`[Manager] セッションID: ${message.session_id}`);
    }
    if ("result" in message) {
      console.log("\n[Manager] 完了:");
      console.log(message.result);

      // コスト記録（推定値）
      const estimatedCost = tasks.reduce((s, t) => s + t.estimateUsd, COST_ESTIMATES.statusOnly);
      recordCost("manager", estimatedCost, tasks.map((t) => t.label).join(", ") || "状況確認のみ");
      budgetUsed = estimatedCost;

      // 完了通知
      const { monthly } = getMonthlyTotal();
      await sendTelegram(
        `✅ <b>Manager Agent 完了</b>\n\n${message.result.slice(0, 400)}\n\n💰 今月累計: $${monthly.toFixed(3)}`,
        "HTML"
      );
    }
  }
}

main().catch(async (err) => {
  console.error("[Manager] エラー:", err);
  await sendTelegram(`❗ Manager Agent エラー\n${err.message}`).catch(() => {});
  process.exit(1);
});
