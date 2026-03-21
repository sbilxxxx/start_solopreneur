/**
 * scripts/hooks/on-blog-write.mjs — content/blog/ への Write 時に Telegram 通知
 *
 * Claude Code の PostToolUse hook として settings.local.json から呼ばれる。
 * stdin から tool call の JSON を受け取り、content/blog/ への書き込みのみ通知する。
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { sendTelegram } from "../lib/notify.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

let raw = "";
for await (const chunk of process.stdin) {
  raw += chunk;
}

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.exit(0); // JSON でなければ無視
}

const filePath = payload?.tool_input?.file_path ?? "";
if (!filePath.includes("content/blog/")) {
  process.exit(0); // blog 以外は無視
}

const filename = filePath.split("/").pop() ?? filePath;
const slug = filename.replace(/\.mdx$/, "");

await sendTelegram(
  `📝 <b>新記事が公開されました</b>\n${slug}\nhttps://start-solopreneur.vercel.app/blog/${slug}`
);
