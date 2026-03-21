/**
 * scripts/lib/notify.mjs — LINE Notify 送信ユーティリティ
 *
 * 直接実行:  node scripts/lib/notify.mjs "メッセージ"
 * インポート: import { sendLine } from "./notify.mjs";
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

/**
 * LINE Notify でメッセージを送信する。
 * TOKEN未設定時はログだけ出して続行する（エージェントを止めない）。
 */
export async function sendLine(message) {
  const token = process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    console.warn("[Notify] LINE_NOTIFY_TOKEN 未設定 — 通知をスキップ");
    return;
  }

  const res = await fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ message }),
  });

  if (res.ok) {
    console.log("[Notify] LINE通知送信完了");
  } else {
    console.error("[Notify] 送信失敗:", res.status, await res.text());
  }
}

// 直接実行: node scripts/lib/notify.mjs "message"
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const message = process.argv[2];
  if (!message) {
    console.error("使い方: node scripts/lib/notify.mjs 'メッセージ'");
    process.exit(1);
  }
  await sendLine(message);
}
