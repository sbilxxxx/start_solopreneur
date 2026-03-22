/**
 * medium.mjs — Medium API v1 投稿スクリプト
 *
 * 必要な環境変数:
 *   MEDIUM_TOKEN — MediumのIntegration Token
 *                  （Settings → Security and apps → Integration tokens）
 *
 * 注意: Medium APIはdraft投稿のみサポート（公開は手動で行う）
 *
 * 使い方:
 *   node scripts/crosspost/medium.mjs <slug>
 *   例: node scripts/crosspost/medium.mjs 2026-03-20-how-to-start-claude-code
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseMdx } from "./converter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const MEDIUM_TOKEN = process.env.MEDIUM_TOKEN;
const API_BASE = "https://api.medium.com/v1";

/**
 * Mediumの著者IDを取得する
 */
async function getAuthorId() {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${MEDIUM_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Medium認証エラー (${res.status})`);
  const data = await res.json();
  return data.data.id;
}

/**
 * Mediumに記事をドラフト投稿する
 * @param {string} filePath - MDXファイルのパス（英語版推奨）
 * @returns {Promise<{url: string, id: string}>}
 */
export async function postToMedium(filePath) {
  if (!MEDIUM_TOKEN) throw new Error("MEDIUM_TOKEN が未設定です");

  const { frontmatter, markdown } = parseMdx(filePath);

  // 英語タイトルがあれば優先、なければ日本語
  const title = frontmatter.titleEn || frontmatter.title;
  const summary = frontmatter.summaryEn || frontmatter.summary || "";

  // 記事本文: 導線を追加
  const content = `${markdown}

---

*Originally published at [Start Solopreneur](https://start-solopreneur.vercel.app)*`;

  const authorId = await getAuthorId();

  const payload = {
    title,
    contentFormat: "markdown",
    content,
    tags: (frontmatter.tags || []).slice(0, 5).map(String),
    publishStatus: "draft", // Medium APIは draft のみ
    notifyFollowers: false,
  };

  const res = await fetch(`${API_BASE}/users/${authorId}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MEDIUM_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Medium API エラー (${res.status}): ${err}`);
  }

  const data = await res.json();
  return { url: data.data.url, id: data.data.id };
}

// 直接実行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  if (!slug) {
    console.error("使い方: node scripts/crosspost/medium.mjs <slug>");
    process.exit(1);
  }

  const filePath = resolve(__dirname, `../../content/blog/${slug}.mdx`);
  console.log(`[Medium] ドラフト投稿中: ${slug}`);

  postToMedium(filePath)
    .then(({ url }) => console.log(`[Medium] ドラフト完了（要手動公開）: ${url}`))
    .catch((e) => { console.error("[Medium] エラー:", e.message); process.exit(1); });
}
