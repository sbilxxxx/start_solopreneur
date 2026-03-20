/**
 * scripts/gen-post-draft.mjs — 記事公開 → X投稿文ドラフト自動生成
 *
 * 使い方:
 *   node scripts/gen-post-draft.mjs content/blog/2026-03-20-slug.mdx
 *   node scripts/gen-post-draft.mjs content/blog/2026-03-20-slug.mdx --date 2026-04-04
 *   node scripts/gen-post-draft.mjs content/blog/2026-03-20-slug.mdx --dry-run
 *
 * 動作:
 *   1. 記事のfrontmatterを読む（title, summary, tags, category）
 *   2. ブログ誘導系のX投稿ドラフト文を生成（要人間レビュー）
 *   3. marketing/sns/YYYY-MM.md の「未投稿ストック」に追記する
 *
 * 注意:
 *   生成されたドラフトはテンプレートベースです。
 *   ブランドボイスに合わせてから schedule-tweet.mjs で投稿してください。
 */

import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE_URL = "https://start-solopreneur.vercel.app";

// --- 引数処理 ---
const args = process.argv.slice(2);
const articleArg = args.find((a) => !a.startsWith("--"));
const dateFlag = args.find((a) => a.startsWith("--date"));
const isDryRun = args.includes("--dry-run");

if (!articleArg) {
  console.error(
    "使い方: node scripts/gen-post-draft.mjs content/blog/YYYY-MM-DD-slug.mdx"
  );
  process.exit(1);
}

const articlePath = resolve(ROOT, articleArg);

if (!existsSync(articlePath)) {
  console.error(`❌ ファイルが見つかりません: ${articlePath}`);
  process.exit(1);
}

// --- 記事読み込み & frontmatterパース ---
const articleContent = await readFile(articlePath, "utf-8");

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = {};
  let currentKey = null;

  for (const line of match[1].split("\n")) {
    // タグ配列の処理: tags: [a, b, c]
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();

    if (key) {
      currentKey = key;
      fm[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return fm;
}

const fm = parseFrontmatter(articleContent);

if (!fm.title) {
  console.error("❌ frontmatterに title がありません");
  process.exit(1);
}

// --- slug & URL ---
const slug = basename(articlePath, ".mdx");
const articleUrl = `${SITE_URL}/blog/${slug}`;

// --- ハッシュタグ ---
function getHashtags(fm) {
  const categoryMap = {
    engineering: "#ClaudeCode",
    business: "#ソロアントレ",
    finance: "#ソロアントレ",
    marketing: "#SNS運用",
  };

  const tags = [];
  const primary = categoryMap[fm.category] ?? "#ソロアントレ";
  tags.push(primary);

  // engineering以外には #ソロアントレ を2つ目に追加
  if (primary !== "#ソロアントレ") tags.push("#ソロアントレ");

  return tags.slice(0, 2).join(" ");
}

// --- 投稿文生成 ---
// テンプレートベース。人間がレビューして調整することを前提とする。
function generateDraftText(fm, articleUrl, hashtags) {
  const summary = fm.summary ?? fm.title;

  // summaryの最初の文をhookとして使う
  const firstSentence = summary.split(/。|\./).filter(Boolean)[0];
  const hook = firstSentence + (summary.includes("。") ? "。" : "");

  return `${hook}

どうだったか記録しました。
${articleUrl}

${hashtags}`;
}

const postText = generateDraftText(fm, articleUrl, getHashtags(fm));

// --- 投稿日決定（次の金曜日 or 指定日） ---
function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getNextFriday(from = new Date()) {
  const d = new Date(from);
  const day = d.getDay(); // 0=Sun, 5=Fri
  const daysUntilFriday = ((5 - day + 7) % 7) || 7;
  d.setDate(d.getDate() + daysUntilFriday);
  return toDateStr(d);
}

const postDate = dateFlag
  ? dateFlag.includes("=")
    ? dateFlag.split("=")[1]
    : args[args.indexOf("--date") + 1]
  : getNextFriday();

// --- SNSファイルへ追記 ---
const [year, month] = postDate.split("-");
const snsFilePath = resolve(ROOT, `marketing/sns/${year}-${month}.md`);

if (!existsSync(snsFilePath)) {
  console.error(`❌ SNSファイルが見つかりません: marketing/sns/${year}-${month}.md`);
  console.error("先に marketing-agent でファイルを作成してください");
  process.exit(1);
}

const snsContent = await readFile(snsFilePath, "utf-8");

// 重複チェック（同じ記事URLが既に存在するか）
if (snsContent.includes(articleUrl)) {
  console.log(`⏭️  すでにドラフトが存在します: ${slug}`);
  process.exit(0);
}

// ドラフトエントリ（schedule-tweet.mjs が認識できる形式）
const draftEntry = `
### 【記事】${fm.title} — ${postDate} 予定

\`\`\`
${postText}
\`\`\`

---
`;

// 「未投稿ストック」セクションの直後に挿入
const MARKER = "## 未投稿ストック";
if (!snsContent.includes(MARKER)) {
  console.error(`❌ SNSファイルに「${MARKER}」セクションがありません`);
  process.exit(1);
}

const markerIdx = snsContent.indexOf(MARKER);
const afterHeaderIdx = snsContent.indexOf("\n", markerIdx) + 1;
const newContent =
  snsContent.slice(0, afterHeaderIdx) +
  draftEntry +
  snsContent.slice(afterHeaderIdx);

// --- 結果表示 ---
console.log(`\n📝 生成したドラフト（要レビュー）:\n`);
console.log(`  記事: ${fm.title}`);
console.log(`  投稿予定日: ${postDate}（次の金曜日）`);
console.log(`  保存先: marketing/sns/${year}-${month}.md`);
console.log(`\n--- 投稿文 ---`);
console.log(postText);
console.log(`--------------\n`);
console.log(`⚠️  ブランドボイスに合わせてドラフトを編集してから投稿してください`);

if (isDryRun) {
  console.log("\n[DRY RUN] ファイルへの書き込みをスキップしました");
  process.exit(0);
}

await writeFile(snsFilePath, newContent, "utf-8");
console.log(`\n✅ marketing/sns/${year}-${month}.md に追加しました`);
