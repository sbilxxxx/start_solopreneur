/**
 * X（Twitter）スケジュール投稿スクリプト
 *
 * 使い方:
 *   node scripts/schedule-tweet.mjs          # 今日の予定投稿を実行
 *   node scripts/schedule-tweet.mjs --dry-run # 実際には投稿せず確認だけ
 *   node scripts/schedule-tweet.mjs --date 2026-03-25  # 指定日の投稿を実行
 *
 * 動作:
 *   1. marketing/sns/YYYY-MM.md を読む
 *   2. 今日の日付に一致する「未投稿ストック」を探す
 *   3. X API で投稿する
 *   4. 投稿済みアーカイブに移動して結果を記録する
 */

import { TwitterApi } from "twitter-api-v2";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

// --- 引数処理 ---
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const dateArg = args.find((a) => a.startsWith("--date"));
const targetDate = dateArg
  ? dateArg.split("=")[1] ?? args[args.indexOf("--date") + 1]
  : toDateString(new Date());

console.log(`📅 対象日: ${targetDate}${isDryRun ? " [DRY RUN]" : ""}`);

// --- SNSファイルのパスを決定 ---
const [year, month] = targetDate.split("-");
const snsFilePath = resolve(
  __dirname,
  `../marketing/sns/${year}-${month}.md`
);

if (!existsSync(snsFilePath)) {
  console.log(`ℹ️  SNSファイルが見つかりません: ${snsFilePath}`);
  process.exit(0);
}

// --- ファイル読み込み ---
const originalContent = await readFile(snsFilePath, "utf-8");

// --- 今日の予定投稿を抽出 ---
// 対象フォーマット: ### [見出し] — YYYY-MM-DD 予定
const scheduled = extractScheduled(originalContent, targetDate);

if (scheduled.length === 0) {
  console.log(`ℹ️  ${targetDate} に予定された投稿はありません`);
  process.exit(0);
}

console.log(`\n📋 ${scheduled.length}件の投稿が見つかりました\n`);

// --- X APIクライアント ---
let client;
if (!isDryRun) {
  const required = [
    "X_API_KEY",
    "X_API_SECRET",
    "X_ACCESS_TOKEN",
    "X_ACCESS_TOKEN_SECRET",
  ];
  for (const v of required) {
    if (!process.env[v]) {
      console.error(`❌ 環境変数 ${v} が設定されていません`);
      process.exit(1);
    }
  }
  client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });
}

// --- 投稿実行 ---
let updatedContent = originalContent;

for (const item of scheduled) {
  console.log(`─────────────────────────`);
  console.log(`📝 見出し: ${item.heading}`);
  console.log(`📄 本文:\n${item.text}\n`);

  if (item.text.length > 280) {
    console.error(`❌ テキストが280字を超えています（${item.text.length}字）。スキップします。`);
    continue;
  }

  if (isDryRun) {
    console.log(`✅ [DRY RUN] 投稿をスキップしました`);
    continue;
  }

  try {
    const tweet = await client.v2.tweet(item.text);
    const tweetId = tweet.data.id;
    const tweetUrl = `https://x.com/bensolopreneur/status/${tweetId}`;

    console.log(`✅ 投稿完了！`);
    console.log(`   ID: ${tweetId}`);
    console.log(`   URL: ${tweetUrl}`);

    // アーカイブエントリを作成
    const archiveEntry =
      `### ${targetDate}（${item.heading}）\n` +
      `**内容:**\n\`\`\`\n${item.text}\n\`\`\`\n` +
      `**ID:** ${tweetId}\n` +
      `**URL:** ${tweetUrl}\n` +
      `**結果:** 計測中`;

    // ファイルを更新（未投稿ストックから削除 → 投稿済みアーカイブに追加）
    updatedContent = archivePost(updatedContent, item.rawBlock, archiveEntry);

    console.log(`📝 アーカイブに記録しました`);
  } catch (err) {
    console.error(`❌ 投稿失敗: ${err.message}`);
  }
}

// --- ファイル書き込み ---
if (!isDryRun && updatedContent !== originalContent) {
  await writeFile(snsFilePath, updatedContent, "utf-8");
  console.log(`\n💾 ${snsFilePath} を更新しました`);
}

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * Date → "YYYY-MM-DD" 文字列（JST基準）
 */
function toDateString(date) {
  // UTC+9 に変換
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * SNSファイルから対象日の予定投稿を抽出する
 * @returns {{ heading, date, text, rawBlock }[]
 */
function extractScheduled(content, date) {
  const results = [];

  // ### [見出し] — DATE 予定 の行を探す
  // その直後のコードブロック（```〜```）をテキストとして取得
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const headingMatch = line.match(/^### (.+) — (\d{4}-\d{2}-\d{2}) 予定/);

    if (headingMatch && headingMatch[2] === date) {
      const heading = headingMatch[1];
      // コードブロックの開始を探す
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;

      if (j < lines.length && lines[j].trim() === "```") {
        const codeStart = j;
        let k = codeStart + 1;
        while (k < lines.length && lines[k].trim() !== "```") k++;
        const codeEnd = k;

        const text = lines.slice(codeStart + 1, codeEnd).join("\n").trim();

        // rawBlock: 見出しからコードブロック終端＋次の --- まで
        let end = codeEnd + 1;
        while (end < lines.length && lines[end].trim() === "") end++;
        if (end < lines.length && lines[end].trim() === "---") end++;

        const rawBlock = lines.slice(i, end).join("\n");

        results.push({ heading, date, text, rawBlock });
        i = end;
        continue;
      }
    }
    i++;
  }

  return results;
}

/**
 * 未投稿ストックから rawBlock を削除し、投稿済みアーカイブに archiveEntry を追加する
 */
function archivePost(content, rawBlock, archiveEntry) {
  // 未投稿ストックから削除
  let updated = content.replace(rawBlock, "").replace(/\n{3,}/g, "\n\n");

  // 投稿済みアーカイブセクションの直後に挿入
  updated = updated.replace(
    /(## 投稿済みアーカイブ\n)/,
    `$1\n${archiveEntry}\n\n---\n\n`
  );

  return updated;
}
