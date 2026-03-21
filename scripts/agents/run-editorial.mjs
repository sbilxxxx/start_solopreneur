/**
 * editorial-agent — コンテンツパイプライン
 *
 * 実行: node scripts/agents/run-editorial.mjs "トピック名"
 * 例:   node scripts/agents/run-editorial.mjs "Claude Codeで自動化した話"
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readdirSync, statSync } from "fs";
import { execSync } from "child_process";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { SUBAGENTS } from "./subagents.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const topic = process.argv[2];
if (!topic) {
  console.error("使い方: node scripts/agents/run-editorial.mjs 'トピック名'");
  process.exit(1);
}

console.log(`[Editorial] トピック: "${topic}"`);
console.log("[Editorial] リサーチ・執筆・SEOチェック・レビューを開始...\n");

for await (const message of query({
  prompt: `「${topic}」についてブログ記事を執筆してください。

執筆完了後、以下の順で処理してください：
1. seo-checker に記事のSEO検証を依頼する
2. content-reviewer に読者評価を依頼する
3. 両者のフィードバックをまとめて最終サマリーを返す

改善が必要な場合は記事を修正してから完了としてください。`,
  options: {
    cwd: process.cwd(),
    allowedTools: [
      "Read",
      "Write",
      "Glob",
      "Grep",
      "WebSearch",
      "WebFetch",
      "Agent",
    ],
    permissionMode: "acceptEdits",
    maxTurns: 60,
    maxBudgetUsd: 1.5,
    agents: {
      "seo-checker": SUBAGENTS["seo-checker"],
      "content-reviewer": SUBAGENTS["content-reviewer"],
    },
  },
})) {
  if ("result" in message) {
    console.log("\n[Editorial] 執筆・レビュー完了");

    // 保存されたドラフトの最新ファイルを英訳
    try {
      const draftsDir = resolve(process.cwd(), "content/drafts");
      const files = readdirSync(draftsDir).filter((f) => f.endsWith(".mdx"));
      const latest = files
        .map((f) => ({ name: f, mtime: statSync(resolve(draftsDir, f)).mtimeMs }))
        .sort((a, b) => b.mtime - a.mtime)[0];

      if (latest) {
        const slug = latest.name.replace(/\.mdx$/, "");
        console.log(`\n[Editorial] 英訳中: ${slug}`);
        execSync(`node scripts/translate-post.mjs ${slug}`, { stdio: "inherit" });
      }
    } catch (e) {
      console.warn("[Editorial] 英訳スキップ:", e.message);
    }

    console.log("\n記事は content/drafts/ に保存されました。");
    console.log("本番公開する場合は content/blog/ に移動してください。");
  }
}
