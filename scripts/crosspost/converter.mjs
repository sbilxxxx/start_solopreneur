/**
 * converter.mjs — MDX → プレーンMarkdown変換
 *
 * 各プラットフォームへの投稿前に MDX 固有の構文を除去する。
 */

import { readFileSync } from "fs";
import matter from "gray-matter";

/**
 * MDXファイルを読み込み、frontmatterとクリーンなmarkdownを返す
 */
export function parseMdx(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);
  const markdown = cleanMarkdown(content);
  return { frontmatter, markdown };
}

/**
 * MDX固有の構文を除去してプレーンMarkdownに変換
 */
function cleanMarkdown(content) {
  return content
    // import文を除去
    .replace(/^import\s+.*$/gm, "")
    // JSXコンポーネント（自己クロージング）を除去
    .replace(/<[A-Z][a-zA-Z]*\s*\/>/g, "")
    // JSXコンポーネント（開始・終了タグ）を除去
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "")
    // export文を除去
    .replace(/^export\s+.*$/gm, "")
    // 連続する空行を最大2行に圧縮
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * カテゴリからZennの絵文字をマッピング
 */
export function categoryToEmoji(category) {
  const map = {
    engineering: "🛠️",
    business: "💼",
    finance: "💰",
    marketing: "📣",
  };
  return map[category] || "📝";
}

/**
 * タグをQiitaタグ形式に変換
 */
export function toQiitaTags(tags) {
  return (tags || []).map((name) => ({ name: String(name), versions: [] }));
}
