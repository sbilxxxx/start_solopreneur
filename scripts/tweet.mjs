/**
 * X（Twitter）投稿スクリプト
 * 使い方: node scripts/tweet.mjs "投稿したいテキスト"
 */
import { TwitterApi } from "twitter-api-v2";
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const requiredVars = [
  "X_API_KEY",
  "X_API_SECRET",
  "X_ACCESS_TOKEN",
  "X_ACCESS_TOKEN_SECRET",
];

for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`❌ 環境変数 ${v} が設定されていません。.env.local を確認してください。`);
    process.exit(1);
  }
}

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

const text = process.argv[2];

if (!text) {
  console.error("❌ 投稿テキストを引数で渡してください。");
  console.error("   例: node scripts/tweet.mjs \"投稿したいテキスト\"");
  process.exit(1);
}

if (text.length > 280) {
  console.error(`❌ テキストが280字を超えています（現在: ${text.length}字）`);
  process.exit(1);
}

try {
  const tweet = await client.v2.tweet(text);
  console.log(`✅ 投稿しました！`);
  console.log(`   ID: ${tweet.data.id}`);
  console.log(`   URL: https://x.com/bensolopreneur/status/${tweet.data.id}`);
} catch (err) {
  console.error("❌ 投稿に失敗しました:", err.message);
  process.exit(1);
}
