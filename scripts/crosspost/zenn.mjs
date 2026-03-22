/**
 * zenn.mjs — Zenn用Markdownファイル生成スクリプト
 *
 * ZennはGitHub連携でのみ記事を管理する。
 * このスクリプトはZenn形式のMarkdownを生成し、
 * 別途Zennと連携したGitHubリポジトリにプッシュする。
 *
 * 必要な環境変数（GitHub連携を使う場合）:
 *   ZENN_GITHUB_TOKEN — Zennリポジトリへの書き込み権限があるGitHub PAT
 *   ZENN_GITHUB_REPO  — Zenn連携リポジトリ（例: sbilxxxx/zenn-content）
 *
 * 使い方:
 *   node scripts/crosspost/zenn.mjs <slug>          # ファイル生成のみ
 *   node scripts/crosspost/zenn.mjs <slug> --push   # 生成 + GitHub push
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { parseMdx, categoryToEmoji } from "./converter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const ZENN_GITHUB_TOKEN = process.env.ZENN_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
const ZENN_GITHUB_REPO = process.env.ZENN_GITHUB_REPO;
const SITE_URL = "https://start-solopreneur.vercel.app";

/**
 * ZennのSlug形式に変換（日付部分を除去）
 * 例: 2026-03-20-how-to-start-claude-code → how-to-start-claude-code
 */
function toZennSlug(slug) {
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

/**
 * カテゴリからZennのtopicsに変換
 */
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

/**
 * Zenn形式のMarkdownを生成する
 */
export function generateZennMarkdown(filePath) {
  const { frontmatter, markdown } = parseMdx(filePath);
  const zennSlug = toZennSlug(
    filePath.replace(/\\/g, "/").split("/").pop().replace(".mdx", "")
  );
  const emoji = categoryToEmoji(frontmatter.category);
  const type = frontmatter.category === "business" ? "idea" : "tech";
  const topics = toZennTopics(frontmatter.category, frontmatter.tags);

  const zennFrontmatter = [
    "---",
    `title: "${frontmatter.title.replace(/"/g, '\\"')}"`,
    `emoji: "${emoji}"`,
    `type: "${type}"`,
    `topics: [${topics.map((t) => `"${t}"`).join(", ")}]`,
    "published: true",
    "---",
  ].join("\n");

  const footer = `\n---\n\n*この記事は [Start Solopreneur](${SITE_URL}/blog/${zennSlug}) にも掲載しています。*`;

  return {
    slug: zennSlug,
    content: `${zennFrontmatter}\n\n${markdown}${footer}`,
  };
}

/**
 * Zennファイルをローカルに保存する
 */
export function saveZennFile(filePath) {
  const { slug, content } = generateZennMarkdown(filePath);
  const outputDir = resolve(__dirname, "../../zenn-articles");
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const outputPath = resolve(outputDir, `${slug}.md`);
  writeFileSync(outputPath, content, "utf-8");
  return { slug, outputPath };
}

/**
 * ZennリポジトリにGitHub API経由でプッシュする
 */
export async function pushToZennRepo(filePath) {
  if (!ZENN_GITHUB_TOKEN) throw new Error("ZENN_GITHUB_TOKEN が未設定です");
  if (!ZENN_GITHUB_REPO) throw new Error("ZENN_GITHUB_REPO が未設定です（例: username/zenn-content）");

  const { slug, content } = generateZennMarkdown(filePath);
  const apiPath = `articles/${slug}.md`;
  const base64Content = Buffer.from(content).toString("base64");

  const headers = {
    Authorization: `Bearer ${ZENN_GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  };

  // 既存ファイルのSHAを取得（更新時に必要）
  let sha;
  const getRes = await fetch(
    `https://api.github.com/repos/${ZENN_GITHUB_REPO}/contents/${apiPath}`,
    { headers }
  );
  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
  }

  // ファイルを作成または更新
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

  const url = `https://zenn.dev/articles/${slug}`;
  return { url, slug };
}

// 直接実行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  const shouldPush = process.argv.includes("--push");

  if (!slug) {
    console.error("使い方: node scripts/crosspost/zenn.mjs <slug> [--push]");
    process.exit(1);
  }

  const filePath = resolve(__dirname, `../../content/blog/${slug}.mdx`);

  if (shouldPush) {
    console.log(`[Zenn] GitHubリポジトリにプッシュ中: ${slug}`);
    pushToZennRepo(filePath)
      .then(({ url }) => console.log(`[Zenn] プッシュ完了: ${url}`))
      .catch((e) => { console.error("[Zenn] エラー:", e.message); process.exit(1); });
  } else {
    console.log(`[Zenn] ファイル生成中: ${slug}`);
    const { outputPath } = saveZennFile(filePath);
    console.log(`[Zenn] 生成完了: ${outputPath}`);
    console.log("[Zenn] ヒント: --push オプションでZennリポジトリに自動プッシュできます");
  }
}
