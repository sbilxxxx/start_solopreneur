/**
 * marketing-agent — X投稿ストック補充
 *
 * 実行: node scripts/agents/run-marketing.mjs [本数]
 * 例:   node scripts/agents/run-marketing.mjs 3
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { SUBAGENTS } from "./subagents.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const count = parseInt(process.argv[2] ?? "3", 10);

console.log(`[Marketing] X投稿ストックを${count}本補充します\n`);

for await (const message of query({
  prompt: `X投稿ストックを${count}本補充してください。
marketing/strategy/x-strategy.mdの方針に従い、marketing/sns/の最新ファイルに追記してください。`,
  options: {
    cwd: process.cwd(),
    allowedTools: ["Read", "Write", "Glob", "Grep"],
    permissionMode: "acceptEdits",
    maxTurns: 20,
    maxBudgetUsd: 0.5,
    agents: {},
  },
})) {
  if ("result" in message) {
    console.log("[Marketing] 完了:");
    console.log(message.result);
  }
}
