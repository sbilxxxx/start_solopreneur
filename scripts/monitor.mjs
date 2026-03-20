/**
 * scripts/monitor.mjs — プロジェクト自動監視スクリプト
 *
 * 使い方:
 *   node scripts/monitor.mjs          # 監視を実行
 *   node scripts/monitor.mjs --dry-run # Issueを作成せず確認だけ
 *
 * 自動実行: Windows Task Scheduler (毎日 9:00)
 *
 * 検出する問題:
 *   1. X投稿の実行漏れ（昨日が月水金なのにアーカイブに記録がない）
 *   2. X投稿ストック残数不足（2本以下）
 *   3. ファイル参照の破損（tasks/current.md や content-roadmap.md が存在しないファイルを参照）
 *   4. 来月のSNSファイル未作成（月末5日前になったら警告）
 */

import { readFile, access } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

config({ path: resolve(ROOT, ".env.local") });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "sbilxxxx/start_solopreneur";
const IS_DRY_RUN = process.argv.includes("--dry-run");

const now = new Date();
const today = toDateStr(now);
const yesterday = toDateStr(new Date(now.getTime() - 86400000));
const [todayYear, todayMonth] = today.split("-");

console.log(`🔍 監視開始: ${today}${IS_DRY_RUN ? " [DRY RUN]" : ""}\n`);

async function main() {
  const detected = [];

  await Promise.allSettled([
    checkMissedXPost(detected),
    checkXPostStock(detected),
    checkFileReferences(detected),
    checkNextMonthSnsFile(detected),
  ]);

  if (detected.length === 0) {
    console.log("✅ 問題なし\n");
    return;
  }

  console.log(`\n⚠️  ${detected.length}件の問題を検出:\n`);
  for (const issue of detected) {
    console.log(`  - [${issue.labels.join(", ")}] ${issue.title}`);
  }
  console.log();

  if (IS_DRY_RUN) {
    console.log("[DRY RUN] Issue作成をスキップしました");
    return;
  }

  for (const issue of detected) {
    await createOrSkipIssue(issue);
  }
}

// ============================================================
// チェック関数
// ============================================================

/**
 * 昨日が投稿予定日（月水金）なのにアーカイブに記録がない場合、実行漏れとして検出する
 */
async function checkMissedXPost(detected) {
  const dayOfWeek = new Date(yesterday + "T00:00:00+09:00").getDay(); // 0=日,1=月,...,5=金
  const isPostDay = [1, 3, 5].includes(dayOfWeek);
  if (!isPostDay) return;

  const [y, m] = yesterday.split("-");
  const snsPath = resolve(ROOT, `marketing/sns/${y}-${m}.md`);

  try {
    const content = await readFile(snsPath, "utf-8");
    const isArchived = new RegExp(`^### ${yesterday}`, "m").test(content);
    const isScheduled = new RegExp(`^### .+ — ${yesterday} 予定`, "m").test(content);

    if (isScheduled && !isArchived) {
      detected.push({
        title: `[Monitor] X投稿が実行されていません（${yesterday}）`,
        body: [
          "## 問題",
          `${yesterday} に投稿予定があったにもかかわらず、アーカイブに記録がありません。`,
          "",
          "## 考えられる原因",
          "- PCがスリープ中で Task Scheduler が実行されなかった",
          "- `scripts/schedule-tweet.mjs` でエラーが発生した",
          "",
          "## 確認手順",
          "```",
          "cat logs/schedule-tweet.log",
          "```",
          "",
          "## 手動実行",
          "```",
          `node scripts/schedule-tweet.mjs --date ${yesterday}`,
          "```",
          "",
          `**検出日時:** ${today}`,
        ].join("\n"),
        labels: ["monitor", "marketing", "bug"],
      });
    }
  } catch {
    // SNSファイルが存在しない月はスキップ
  }
}

/**
 * 未投稿ストックが残り2本以下になったら補充を促す
 */
async function checkXPostStock(detected) {
  const snsPath = resolve(ROOT, `marketing/sns/${todayYear}-${todayMonth}.md`);

  try {
    const content = await readFile(snsPath, "utf-8");
    const stocks = [...content.matchAll(/^### 【.+】.+ — \d{4}-\d{2}-\d{2} 予定/gm)];
    const count = stocks.length;

    if (count > 2) return;

    const severity = count <= 1 ? "緊急" : "推奨";
    detected.push({
      title: `[Monitor] X投稿ストックが残り${count}本です（補充${severity}）`,
      body: [
        "## 問題",
        `未投稿ストックが残り **${count}本** になりました。`,
        "",
        "## 残っているストック",
        ...stocks.map((s) => `- ${s[0]}`),
        "",
        "## 推奨アクション",
        "`marketing-agent` に来月分の投稿文を作成させてください。",
        "",
        "```",
        "marketing-agentへ: 来月分のX投稿ストックを8本作成して marketing/sns/YYYY-MM.md に追加して",
        "```",
        "",
        `**検出日時:** ${today}`,
      ].join("\n"),
      labels: ["monitor", "marketing"],
    });
  } catch {
    // スキップ
  }
}

/**
 * 主要ファイル内のファイル参照が実在するかチェックする
 */
async function checkFileReferences(detected) {
  const targets = [
    "tasks/current.md",
    "notes/decisions/2026-03-20-content-roadmap.md",
    "notes/decisions/2026-03-20-agent-design.md",
  ];

  for (const target of targets) {
    try {
      const content = await readFile(resolve(ROOT, target), "utf-8");
      const refs = [
        ...content.matchAll(/`((?:notes\/decisions|tasks|marketing|content|src)\/[^`]+\.(?:md|ts|tsx|mjs))`/g),
      ].map((m) => m[1]);

      for (const ref of [...new Set(refs)]) {
        // YYYY・MM などのテンプレートプレースホルダーを含むパスは除外
        if (/YYYY|MM|DD|\*/.test(ref)) continue;

        try {
          await access(resolve(ROOT, ref));
        } catch {
          detected.push({
            title: `[Monitor] 存在しないファイルへの参照: ${ref}`,
            body: [
              "## 問題",
              `\`${target}\` が存在しないファイルを参照しています。`,
              "",
              "## 存在しないファイル",
              `\`${ref}\``,
              "",
              "## 推奨アクション",
              "- ファイル名が変更された場合: 参照先を正しいファイル名に更新する",
              "- ファイルが削除された場合: 参照を削除する",
              "",
              `**検出元:** \`${target}\``,
              `**検出日時:** ${today}`,
            ].join("\n"),
            labels: ["monitor", "docs"],
          });
        }
      }
    } catch {
      // ターゲットファイル自体がなければスキップ
    }
  }
}

/**
 * 月末5日前になったら来月のSNSファイル未作成を警告する
 */
async function checkNextMonthSnsFile(detected) {
  const daysInMonth = new Date(+todayYear, +todayMonth, 0).getDate();
  const dayOfMonth = now.getDate();
  if (daysInMonth - dayOfMonth > 5) return;

  const nextMonth = +todayMonth === 12 ? 1 : +todayMonth + 1;
  const nextYear = +todayMonth === 12 ? +todayYear + 1 : +todayYear;
  const nextMonthStr = String(nextMonth).padStart(2, "0");
  const nextFilePath = resolve(ROOT, `marketing/sns/${nextYear}-${nextMonthStr}.md`);

  try {
    await access(nextFilePath);
  } catch {
    detected.push({
      title: `[Monitor] 来月(${nextYear}-${nextMonthStr})のX投稿ファイルが未作成です`,
      body: [
        "## 問題",
        `来月分のX投稿管理ファイル \`marketing/sns/${nextYear}-${nextMonthStr}.md\` がまだ作成されていません。`,
        "",
        "## 推奨アクション",
        "`marketing-agent` に来月分のファイルと投稿ストックを作成させてください。",
        "",
        `**検出日時:** ${today}`,
      ].join("\n"),
      labels: ["monitor", "marketing"],
    });
  }
}

// ============================================================
// GitHub Issues
// ============================================================

async function getOpenMonitorIssues() {
  if (!GITHUB_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/issues?state=open&labels=monitor&per_page=100`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function createOrSkipIssue(issue) {
  if (!GITHUB_TOKEN) {
    console.warn("  ⚠️  GITHUB_TOKEN が未設定のため Issue を作成できません");
    return;
  }

  const openIssues = await getOpenMonitorIssues();
  const alreadyExists = openIssues.some((i) => i.title === issue.title);
  if (alreadyExists) {
    console.log(`  ⏭️  既存Issue あり（スキップ）: ${issue.title}`);
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`  ❌ Issue作成失敗: ${err}`);
      return;
    }

    const data = await res.json();
    console.log(`  ✅ Issue作成: #${data.number} — ${data.html_url}`);
  } catch (err) {
    console.error(`  ❌ エラー: ${err.message}`);
  }
}

// ============================================================
// ユーティリティ
// ============================================================

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

main().catch(console.error);
