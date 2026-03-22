/**
 * crosspost.mjs — クロス発信オーケストレーター
 *
 * 指定したスラッグの記事を複数プラットフォームに一括投稿する。
 *
 * 使い方:
 *   node scripts/crosspost/crosspost.mjs <slug> [--platforms qiita,medium,zenn]
 *   node scripts/crosspost/crosspost.mjs <slug> --dry-run   # 実際には投稿しない
 *
 * 例:
 *   node scripts/crosspost/crosspost.mjs 2026-03-20-how-to-start-claude-code
 *   node scripts/crosspost/crosspost.mjs 2026-03-20-what-is-claude-code --platforms qiita,zenn
 *
 * npm script:
 *   npm run crosspost 2026-03-20-how-to-start-claude-code
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { postToQiita } from "./qiita.mjs";
import { postToMedium } from "./medium.mjs";
import { pushToZennRepo, saveZennFile } from "./zenn.mjs";
import { sendTelegram } from "../lib/notify.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const POSTED_DB = resolve(__dirname, "./posted.json");
const CONTENT_DIR = resolve(__dirname, "../../content/blog");

function loadPostedDb() {
  if (!existsSync(POSTED_DB)) return { articles: {} };
  return JSON.parse(readFileSync(POSTED_DB, "utf-8"));
}

function savePostedDb(db) {
  writeFileSync(POSTED_DB, JSON.stringify(db, null, 2), "utf-8");
}

function isAlreadyPosted(db, slug, platform) {
  return !!(db.articles[slug]?.[platform]);
}

function recordPost(db, slug, platform, url) {
  if (!db.articles[slug]) db.articles[slug] = {};
  db.articles[slug][platform] = { url, postedAt: new Date().toISOString() };
}

async function main() {
  const slug = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");
  const platformsFlagIndex = process.argv.indexOf("--platforms");
  const platformsInline = process.argv.find((a) => a.startsWith("--platforms="))
    ?.replace("--platforms=", "");
  const platformsArg = platformsInline
    || (platformsFlagIndex !== -1 ? process.argv[platformsFlagIndex + 1] : undefined);

  const platforms = platformsArg
    ? platformsArg.split(",").map((p) => p.trim())
    : ["qiita", "medium", "zenn"];

  if (!slug) {
    console.error("使い方: node scripts/crosspost/crosspost.mjs <slug> [--platforms qiita,medium,zenn] [--dry-run]");
    process.exit(1);
  }

  const filePath = resolve(CONTENT_DIR, `${slug}.mdx`);
  if (!existsSync(filePath)) {
    console.error(`記事が見つかりません: ${filePath}`);
    process.exit(1);
  }

  console.log(`\n[Crosspost] 対象記事: ${slug}`);
  console.log(`[Crosspost] プラットフォーム: ${platforms.join(", ")}`);
  if (dryRun) console.log("[Crosspost] ⚠️  DRY RUN モード（実際には投稿しません）");

  const db = loadPostedDb();
  const results = [];

  for (const platform of platforms) {
    if (isAlreadyPosted(db, slug, platform)) {
      const existing = db.articles[slug][platform];
      console.log(`[${platform}] ✅ 投稿済みのためスキップ: ${existing.url}`);
      results.push({ platform, status: "skipped", url: existing.url });
      continue;
    }

    console.log(`\n[${platform}] 投稿中...`);

    if (dryRun) {
      console.log(`[${platform}] DRY RUN: スキップ`);
      results.push({ platform, status: "dry-run" });
      continue;
    }

    try {
      let url = "";

      if (platform === "qiita") {
        const res = await postToQiita(filePath);
        url = res.url;
      } else if (platform === "medium") {
        const res = await postToMedium(filePath);
        url = res.url;
        console.log(`[Medium] ⚠️  ドラフト保存（手動公開が必要）`);
      } else if (platform === "zenn") {
        const zennRewrite = !process.argv.includes("--no-rewrite");
        if (process.env.ZENN_GITHUB_REPO) {
          const res = await pushToZennRepo(filePath, { rewrite: zennRewrite });
          url = res.url;
        } else {
          const { outputPath } = await saveZennFile(filePath, { rewrite: zennRewrite });
          url = `file://${outputPath}`;
          console.log(`[Zenn] ⚠️  ZENN_GITHUB_REPO未設定 → ローカル生成: ${outputPath}`);
        }
      } else {
        console.warn(`[Crosspost] 未対応のプラットフォーム: ${platform}`);
        continue;
      }

      recordPost(db, slug, platform, url);
      savePostedDb(db);
      console.log(`[${platform}] ✅ 完了: ${url}`);
      results.push({ platform, status: "success", url });

    } catch (err) {
      console.error(`[${platform}] ❌ エラー: ${err.message}`);
      results.push({ platform, status: "error", error: err.message });
    }
  }

  // 結果サマリー
  console.log("\n=== クロス発信結果 ===");
  results.forEach(({ platform, status, url, error }) => {
    if (status === "success") console.log(`✅ ${platform}: ${url}`);
    else if (status === "skipped") console.log(`⏭️  ${platform}: 投稿済み`);
    else if (status === "dry-run") console.log(`🔍 ${platform}: dry-run`);
    else console.log(`❌ ${platform}: ${error}`);
  });

  // Telegram通知
  if (!dryRun) {
    const successCount = results.filter((r) => r.status === "success").length;
    if (successCount > 0) {
      const lines = results
        .filter((r) => r.status === "success")
        .map((r) => `• ${r.platform}: ${r.url}`)
        .join("\n");
      await sendTelegram(
        `📢 <b>クロス発信完了</b>\n記事: ${slug}\n\n${lines}`,
        "HTML"
      ).catch(() => {});
    }
  }
}

main().catch((err) => {
  console.error("[Crosspost] 予期しないエラー:", err);
  process.exit(1);
});
