/**
 * qiita.mjs — Qiita API v2 投稿スクリプト
 *
 * 必要な環境変数:
 *   QIITA_TOKEN — QiitaのAPIトークン（設定 → アプリケーション → 個人用アクセストークン）
 *
 * 使い方:
 *   node scripts/crosspost/qiita.mjs <slug>
 *   例: node scripts/crosspost/qiita.mjs 2026-03-20-how-to-start-claude-code
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseMdx, toQiitaTags } from "./converter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const QIITA_TOKEN = process.env.QIITA_TOKEN;
const API_BASE = "https://qiita.com/api/v2";

/**
 * Qiitaに記事を投稿する
 * @param {string} filePath - MDXファイルのパス
 * @param {object} options
 * @param {boolean} options.private - 限定公開にするか（デフォルト: false）
 * @returns {Promise<{url: string, id: string}>}
 */
export async function postToQiita(filePath, { private: isPrivate = false } = {}) {
  if (!QIITA_TOKEN) throw new Error("QIITA_TOKEN が未設定です");

  const { frontmatter, markdown } = parseMdx(filePath);

  // 記事本文: サイトURLへの導線を追加
  const body = `${markdown}

---

*この記事は [Start Solopreneur](https://start-solopreneur.vercel.app) にも掲載しています。*`;

  const payload = {
    title: frontmatter.title,
    body,
    tags: toQiitaTags(frontmatter.tags),
    private: isPrivate,
    tweet: false,
  };

  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${QIITA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Qiita API エラー (${res.status}): ${err}`);
  }

  const data = await res.json();
  return { url: data.url, id: data.id };
}

// 直接実行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  if (!slug) {
    console.error("使い方: node scripts/crosspost/qiita.mjs <slug>");
    process.exit(1);
  }

  const filePath = resolve(__dirname, `../../content/blog/${slug}.mdx`);
  console.log(`[Qiita] 投稿中: ${slug}`);

  postToQiita(filePath)
    .then(({ url }) => console.log(`[Qiita] 投稿完了: ${url}`))
    .catch((e) => { console.error("[Qiita] エラー:", e.message); process.exit(1); });
}
