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

/**
 * urgentOnly=true のとき urgent ラベル付きのみ取得
 * urgentOnly=false のとき instruction ラベル付き全件取得
 */
async function getPendingInstructions(urgentOnly = false) {
  const labels = urgentOnly ? "instruction,urgent" : "instruction";
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues?state=open&labels=${labels}&per_page=5`,
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

/**
 * Issue本文から複雑度タグを読み取り、適切な実行パラメータを返す
 *  [complexity: simple]  → 小変更（テキスト・色・スタイル等）
 *  [complexity: complex] → 大きな実装・機能追加
 *  タグなし              → 中程度（デフォルト）
 */
function resolveSettings(issueBody) {
  if (issueBody?.includes("[complexity: simple]")) {
    return { maxTurns: 6, maxBudgetUsd: 0.08, label: "simple" };
  }
  if (issueBody?.includes("[complexity: complex]")) {
    return { maxTurns: 15, maxBudgetUsd: 0.25, label: "complex" };
  }
  return { maxTurns: 10, maxBudgetUsd: 0.15, label: "medium" };
}

async function executeInstruction(issue) {
  const { number, title, body } = issue;
  const instruction = body || title;
  const settings = resolveSettings(body);

  console.log(`\n[Instruction] Issue #${number}: ${title}`);
  console.log(`[Instruction] 複雑度: ${settings.label} (maxTurns=${settings.maxTurns}, budget=$${settings.maxBudgetUsd})`);
  console.log("[Instruction] 実行中...\n");

  // 実行中をTelegramに通知
  await sendTelegram(`⚙️ <b>指示を実行中</b>\nIssue #${number}: ${title}`, "HTML");

  let resultText = "";
  const assistantTexts = [];

  try {
    for await (const message of query({
      prompt: `以下の指示を実行してください。CLAUDE.mdのルールに従い、安全な変更のみ行うこと。

## 指示
${instruction}

## 制約
- 本番デプロイ・課金・外部サービスへの直接操作はしない
- 完了したら必ず「## 実行結果」として何をしたか箇条書きで詳細に報告すること（例: 変更したファイル・追加した機能・修正内容など）

## 効率化ルール（厳守）
- 必要なファイルだけ読む（不要なグローバル探索は禁止）
- 同じファイルを2回以上読まない
- Globで対象を絞ってからReadする
- 変更は要件を満たす最小限にする
- 結果報告は簡潔に（箇条書き3〜5行が目標）`,
      options: {
        cwd: process.cwd(),
        allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"],
        permissionMode: "acceptEdits",
        maxTurns: settings.maxTurns,
        maxBudgetUsd: settings.maxBudgetUsd,
      },
    })) {
      // アシスタントのテキストブロックを収集（フォールバック用）
      if (message.type === "assistant" && Array.isArray(message.message?.content)) {
        for (const block of message.message.content) {
          if (block.type === "text" && block.text) {
            assistantTexts.push(block.text);
          }
        }
      }
      if ("result" in message) {
        resultText = message.result;
      }
    }

    // resultText が空の場合、全アシスタントメッセージから「## 実行結果」セクションを検索
    if (!resultText && assistantTexts.length > 0) {
      const allText = assistantTexts.join("\n\n");
      const resultIndex = allText.indexOf("## 実行結果");
      if (resultIndex !== -1) {
        resultText = allText.slice(resultIndex);
      } else {
        resultText = allText;
      }
    }

    // git の変更サマリーを取得
    let gitSummary = "";
    try {
      const { execSync } = await import("child_process");
      const stat = execSync("git diff --stat HEAD 2>/dev/null || git status --short 2>/dev/null")
        .toString()
        .trim();
      if (stat) {
        gitSummary = `\n\n📁 <b>変更ファイル:</b>\n<code>${stat.slice(0, 300)}</code>`;
      }
    } catch { /* git情報取得失敗は無視 */ }

    // 成功
    const comment = `✅ 実行完了\n\n${resultText}`;
    await commentAndClose(number, comment);
    const telegramBody = resultText
      ? `${resultText.slice(0, 500)}${gitSummary}`
      : `（詳細ログはGitHub Issue #${number}を確認）${gitSummary}`;
    await sendTelegram(
      `✅ <b>指示完了</b>\nIssue #${number}: ${title}\n\n${telegramBody}`,
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
  // --urgent フラグがあれば urgent ラベル付きのみ処理
  const urgentOnly = process.argv.includes("--urgent");
  const issues = await getPendingInstructions(urgentOnly);

  if (issues.length === 0) {
    console.log(`[Instruction] 未処理の指示Issueなし（${urgentOnly ? "urgent" : "全件"}）。終了。`);
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
