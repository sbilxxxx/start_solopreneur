/**
 * Telegram Webhook を登録する（初回セットアップ時に1回だけ実行）
 *
 * 実行: node scripts/lib/setup-telegram-webhook.mjs
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env.local") });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const SITE_URL = "https://start-solopreneur.vercel.app";

if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN が未設定です");
  process.exit(1);
}

const webhookUrl = `${SITE_URL}/api/telegram-webhook`;

const res = await fetch(
  `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: WEBHOOK_SECRET ?? "",
      allowed_updates: ["callback_query", "message"],
    }),
  }
);

const data = await res.json();
if (data.ok) {
  console.log("✅ Webhook登録完了:", webhookUrl);
} else {
  console.error("❌ Webhook登録失敗:", data);
}

// 現在のWebhook情報を表示
const info = await fetch(
  `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
).then((r) => r.json());
console.log("\n現在のWebhook情報:", JSON.stringify(info.result, null, 2));
