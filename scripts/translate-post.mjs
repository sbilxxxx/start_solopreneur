/**
 * scripts/translate-post.mjs — 記事の titleEn / summaryEn を自動生成
 *
 * 実行: node scripts/translate-post.mjs <slug>
 * 例:   node scripts/translate-post.mjs 2026-03-20-what-is-claude-code
 *
 * content/blog/ または content/drafts/ の MDX frontmatter を更新する。
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, existsSync } from "fs";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
config({ path: resolve(ROOT, ".env.local") });

const slug = process.argv[2];
if (!slug) {
  console.error("使い方: node scripts/translate-post.mjs <slug>");
  process.exit(1);
}

// blog/ または drafts/ から検索
const candidates = [
  resolve(ROOT, "content/blog", `${slug}.mdx`),
  resolve(ROOT, "content/drafts", `${slug}.mdx`),
];
const filePath = candidates.find((p) => existsSync(p));
if (!filePath) {
  console.error(`記事が見つかりません: ${slug}`);
  process.exit(1);
}

const raw = readFileSync(filePath, "utf-8");
const { data: frontmatter, content } = matter(raw);

console.log(`[Translate] ${frontmatter.title}`);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: "claude-haiku-4-5",
  max_tokens: 300,
  messages: [
    {
      role: "user",
      content: `以下の日本語ブログ記事のタイトルとサマリーを英語に翻訳してください。
ソロアントレプレナー向けのブログ記事です。自然な英語で、SEOを意識してください。

タイトル: ${frontmatter.title}
サマリー: ${frontmatter.summary}

以下のJSON形式のみで返してください（他のテキスト不要）:
{"titleEn": "...", "summaryEn": "..."}`,
    },
  ],
});

const text =
  response.content[0].type === "text" ? response.content[0].text.trim() : "";

let translated;
try {
  translated = JSON.parse(text);
} catch {
  console.error("[Translate] JSONパースエラー:", text);
  process.exit(1);
}

// frontmatter を更新して書き戻す
frontmatter.titleEn = translated.titleEn;
frontmatter.summaryEn = translated.summaryEn;

const updated = matter.stringify(content, frontmatter);
writeFileSync(filePath, updated, "utf-8");

console.log(`[Translate] 完了`);
console.log(`  titleEn:   ${translated.titleEn}`);
console.log(`  summaryEn: ${translated.summaryEn}`);
