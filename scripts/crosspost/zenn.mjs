/**
 * zenn.mjs — Zenn用Markdownファイル生成スクリプト
 *
 * 必要な環境変数:
 *   ZENN_GITHUB_TOKEN  — GitHub PAT（zenn-contentリポジトリへの書き込み権限）
 *   ZENN_GITHUB_REPO   — Zenn連携リポジトリ（例: sbilxxxx/zenn-content）
 *   ANTHROPIC_API_KEY  — AIリライト使用時に必要
 *
 * 使い方:
 *   node scripts/crosspost/zenn.mjs <slug>           # ファイル生成のみ
 *   node scripts/crosspost/zenn.mjs <slug> --rewrite # AIリライト後に生成
 *   node scripts/crosspost/zenn.mjs <slug> --push    # 生成 + push
 *   node scripts/crosspost/zenn.mjs <slug> --rewrite --push  # リライト + push
 */

import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { parseMdx, categoryToEmoji } from "./converter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const ZENN_GITHUB_TOKEN = process.env.ZENN_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
const ZENN_GITHUB_REPO = process.env.ZENN_GITHUB_REPO;
const SITE_URL = "https://start-solopreneur.vercel.app";

// ─── ヘルパー ────────────────────────────────────────────────────────────────

function toZennSlug(slug) {
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function toZennTopics(category, tags) {
  const categoryMap = {
    engineering: ["claudecode"],
    business: ["ビジネス"],
    finance: ["個人開発"],
    marketing: ["マーケティング"],
  };
  const base = categoryMap[category] || [];
  const extra = (tags || [])
    .map((t) => String(t).toLowerCase().replace(/\s+/g, ""))
    .filter((t) => !base.includes(t))
    .slice(0, 4);
  return [...base, ...extra].slice(0, 5);
}

function buildFrontmatter(frontmatter) {
  const emoji = categoryToEmoji(frontmatter.category);
  const type = frontmatter.category === "business" ? "idea" : "tech";
  const topics = toZennTopics(frontmatter.category, frontmatter.tags);
  return [
    "---",
    `title: "${frontmatter.title.replace(/"/g, '\\"')}"`,
    `emoji: "${emoji}"`,
    `type: "${type}"`,
    `topics: [${topics.map((t) => `"${t}"`).join(", ")}]`,
    "published: true",
    "---",
  ].join("\n");
}

// ─── AIリライト ───────────────────────────────────────────────────────────────

/**
 * Zenn向けにMarkdown本文をAIでリライトする
 */
export async function rewriteForZenn(markdown, frontmatter) {
  const client = new Anthropic();

  const prompt = `以下のブログ記事をZenn向けにリライトしてください。

## リライトのルール
- Zennはエンジニア向けの技術記事プラットフォーム。読者は技術に詳しい
- 個人ブログの「一人語り・日記調」→「技術記事らしい実用的な文体」に変換
- 導入文は「この記事でわかること」を明確にする（例：「この記事では〜を解説します」）
- Zenn独自のMarkdown記法を活用する:
  - :::message（ポイントや注意事項）
  - :::details（補足情報の折りたたみ）
- 章立ては維持しつつ、見出しを「実用的な表現」に調整してもOK
- コードブロックはそのまま残す
- 結論・まとめは「実際に試してみた結果」「ポイントのまとめ」として締める
- 文体: 「〜です」「〜ます」調（です・ます体）で統一

## 元記事カテゴリ
${frontmatter.category} / タグ: ${(frontmatter.tags || []).join(", ")}

## 元記事本文
${markdown}

## 出力形式
Markdownのみ出力してください（frontmatterは不要、本文のみ）。`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].type === "text" ? message.content[0].text : markdown;
}

// ─── ファイル生成 ─────────────────────────────────────────────────────────────

export async function generateZennMarkdown(filePath, { rewrite = false } = {}) {
  const { frontmatter, markdown } = parseMdx(filePath);
  const slug = filePath.replace(/\\/g, "/").split("/").pop().replace(".mdx", "");
  const zennSlug = toZennSlug(slug);

  const body = rewrite
    ? await rewriteForZenn(markdown, frontmatter)
    : markdown;

  const footer = `\n---\n\n*この記事は [Start Solopreneur](${SITE_URL}/blog/${zennSlug}) にも掲載しています。*`;
  const content = `${buildFrontmatter(frontmatter)}\n\n${body}${footer}`;

  return { slug: zennSlug, content };
}

export async function saveZennFile(filePath, options = {}) {
  const { slug, content } = await generateZennMarkdown(filePath, options);
  const outputDir = resolve(__dirname, "../../zenn-articles");
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const outputPath = resolve(outputDir, `${slug}.md`);
  writeFileSync(outputPath, content, "utf-8");
  return { slug, outputPath, content };
}

// ─── GitHub push ──────────────────────────────────────────────────────────────

export async function pushToZennRepo(filePath, options = {}) {
  if (!ZENN_GITHUB_TOKEN) throw new Error("ZENN_GITHUB_TOKEN が未設定です");
  if (!ZENN_GITHUB_REPO) throw new Error("ZENN_GITHUB_REPO が未設定です");

  // ローカルに保存済みファイルがあればそれを使う（手動編集を尊重）
  const { slug } = await generateZennMarkdown(filePath, {});
  const localPath = resolve(__dirname, `../../zenn-articles/${slug}.md`);
  let content;

  if (existsSync(localPath) && !options.rewrite) {
    console.log(`[Zenn] ローカルファイルを使用: ${localPath}`);
    content = readFileSync(localPath, "utf-8");
  } else {
    const result = await saveZennFile(filePath, options);
    content = result.content;
  }

  const apiPath = `articles/${slug}.md`;
  const base64Content = Buffer.from(content).toString("base64");
  const headers = {
    Authorization: `Bearer ${ZENN_GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  };

  // 既存SHAを取得（更新時に必要）
  let sha;
  const getRes = await fetch(
    `https://api.github.com/repos/${ZENN_GITHUB_REPO}/contents/${apiPath}`,
    { headers }
  );
  if (getRes.ok) sha = (await getRes.json()).sha;

  const putRes = await fetch(
    `https://api.github.com/repos/${ZENN_GITHUB_REPO}/contents/${apiPath}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `add: ${slug}`,
        content: base64Content,
        ...(sha && { sha }),
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub API エラー (${putRes.status}): ${err}`);
  }

  return { url: `https://zenn.dev/articles/${slug}`, slug };
}

// ─── 直接実行 ─────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  const shouldPush = process.argv.includes("--push");
  const shouldRewrite = process.argv.includes("--rewrite");

  if (!slug) {
    console.error("使い方: node scripts/crosspost/zenn.mjs <slug> [--rewrite] [--push]");
    process.exit(1);
  }

  const filePath = resolve(__dirname, `../../content/blog/${slug}.mdx`);

  (async () => {
    if (shouldRewrite) console.log("[Zenn] AIリライト中...");

    if (shouldPush) {
      console.log(`[Zenn] GitHubにプッシュ中: ${slug}`);
      const { url } = await pushToZennRepo(filePath, { rewrite: shouldRewrite });
      console.log(`[Zenn] ✅ プッシュ完了: ${url}`);
    } else {
      const { outputPath } = await saveZennFile(filePath, { rewrite: shouldRewrite });
      console.log(`[Zenn] ✅ 生成完了: ${outputPath}`);
      console.log("[Zenn] 確認・編集後に --push で公開できます");
    }
  })().catch((e) => { console.error("[Zenn] エラー:", e.message); process.exit(1); });
}
