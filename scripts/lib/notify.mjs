/**
 * scripts/lib/notify.mjs — Telegram 通知ユーティリティ
 *
 * 直接実行（テキスト）:
 *   node scripts/lib/notify.mjs "メッセージ"
 *
 * 直接実行（承認ボタン付き）:
 *   node scripts/lib/notify.mjs "本文" --issue 12
 *
 * インポート:
 *   import { sendTelegram, sendApprovalRequest } from "./notify.mjs";
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

function checkEnv() {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("[Notify] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 未設定 — スキップ");
    return false;
  }
  return true;
}

/** テキストメッセージを送信する */
export async function sendTelegram(text) {
  if (!checkEnv()) return;

  const res = await fetch(`${BASE_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
  });

  if (res.ok) {
    console.log("[Notify] Telegram通知送信完了");
  } else {
    console.error("[Notify] 送信失敗:", res.status, await res.text());
  }
}

/**
 * 承認リクエストをインラインボタン付きで送信する。
 * ユーザーがボタンを押すと /api/telegram-webhook が呼ばれる。
 *
 * @param {string} text     メッセージ本文
 * @param {number} issueNumber  GitHub Issue番号
 */
export async function sendApprovalRequest(text, issueNumber) {
  if (!checkEnv()) return;

  const res = await fetch(`${BASE_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ 承認", callback_data: `approve:${issueNumber}` },
            { text: "❌ 却下", callback_data: `reject:${issueNumber}` },
          ],
        ],
      },
    }),
  });

  if (res.ok) {
    console.log(`[Notify] 承認リクエスト送信完了 (Issue #${issueNumber})`);
  } else {
    console.error("[Notify] 送信失敗:", res.status, await res.text());
  }
}

// 直接実行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const text = process.argv[2];
  const issueFlag = process.argv.indexOf("--issue");
  const issueNumber = issueFlag !== -1 ? parseInt(process.argv[issueFlag + 1]) : null;

  if (!text) {
    console.error("使い方:");
    console.error('  node scripts/lib/notify.mjs "メッセージ"');
    console.error('  node scripts/lib/notify.mjs "メッセージ" --issue 12');
    process.exit(1);
  }

  if (issueNumber) {
    await sendApprovalRequest(text, issueNumber);
  } else {
    await sendTelegram(text);
  }
}
