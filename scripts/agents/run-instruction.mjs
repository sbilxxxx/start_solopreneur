/**
 * run-instruction.mjs — TelegramからのClaude Code指示を実行する
 *
 * GitHub Issueに "instruction" ラベルがついたものを取得し、
 * Claude Codeで実行 → 結果をIssueにコメント + Telegram通知。
 *
 * 実行: node scripts/agents/run-instruction.mjs
 * Task Scheduler: 30分おきに自動実行推奨
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { sendTelegram } from "../lib/notify.mjs";
import { recordCost } from "../lib/cost-tracker.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const REPO = "sbilxxxx/start_solopreneur";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function getPendingInstructions() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues?state=open&labels=instruction&per_page=5`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
  );
  if (!res.ok) return [];
  const issues = await res.json();
  return Array.isArray(issues) ? issues : [];
}

async function commentAndClose(issueNumber, comment) {
  const base = `https://api.github.com/repos/${REPO}/issues/${issueNumber}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  };
  await fetch(`${base}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ body: comment }),
  });
  await fetch(base, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ state: "closed" }),
  });
}

async function executeInstruction(issue) {
  const { number, title, body } = issue;
  const instruction = body || title;

  console.log(`\n[Instruction] Issue #${number}: ${title}`);
  console.log("[Instruction] 実行中...\n");

  // 実行中をTelegramに通知
  await sendTelegram(`⚙️ <b>指示を実行中</b>\nIssue #${number}: ${title}`, "HTML");

  let resultText = "";

  try {
    for await (const message of query({
      prompt: `以下の指示を実行してください。CLAUDE.mdのルールに従い、安全な変更のみ行うこと。

## 指示
${instruction}

## 制約
- 本番デプロイ・課金・外部サービスへの直接操作はしない
- 完了したら何をしたか簡潔に報告する`,
      options: {
        cwd: process.cwd(),
        allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"],
        permissionMode: "acceptEdits",
        maxTurns: 20,
        maxBudgetUsd: 0.3,
      },
    })) {
      if ("result" in message) {
        resultText = message.result;
      }
    }

    // 成功
    const comment = `✅ 実行完了\n\n${resultText}`;
    await commentAndClose(number, comment);
    await sendTelegram(
      `✅ <b>指示完了</b>\nIssue #${number}: ${title}\n\n${resultText.slice(0, 400)}`,
      "HTML"
    );
    recordCost("instruction", 0.15, title);

  } catch (err) {
    // 失敗
    const errMsg = err instanceof Error ? err.message : String(err);
    await commentAndClose(number, `❌ 実行エラー\n\n${errMsg}`);
    await sendTelegram(
      `❌ <b>指示エラー</b>\nIssue #${number}: ${title}\n${errMsg}`,
      "HTML"
    );
  }
}

async function main() {
  const issues = await getPendingInstructions();

  if (issues.length === 0) {
    console.log("[Instruction] 未処理の指示Issueなし。終了。");
    return;
  }

  console.log(`[Instruction] ${issues.length}件の指示を処理します`);

  // 1件ずつ処理（並列実行しない）
  for (const issue of issues) {
    await executeInstruction(issue);
  }
}

main().catch((err) => {
  console.error("[Instruction] エラー:", err);
  process.exit(1);
});
