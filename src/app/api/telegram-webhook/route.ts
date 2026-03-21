import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;
const REPO = "sbilxxxx/start_solopreneur";

export async function POST(req: NextRequest) {
  // Telegramから送られるシークレットトークンで検証
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const callbackQuery = body.callback_query;
  if (!callbackQuery) {
    return NextResponse.json({ ok: true });
  }

  const { id: callbackId, data, from } = callbackQuery;
  const [action, issueNumberStr] = data.split(":");
  const issueNumber = parseInt(issueNumberStr);

  // ボタンの押下感を消す（必須）
  await answerCallback(callbackId);

  if (action === "approve") {
    await closeIssue(issueNumber);
    await sendMessage(
      from.id,
      `✅ Issue #${issueNumber} を承認しました。次回のmanager-agent実行時に処理されます。`
    );
  } else if (action === "reject") {
    await commentIssue(issueNumber, "❌ 却下しました（Telegramから）");
    await sendMessage(
      from.id,
      `❌ Issue #${issueNumber} を却下しました。理由があればGitHubにコメントしてください。`
    );
  }

  return NextResponse.json({ ok: true });
}

async function answerCallback(callbackQueryId: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  });
}

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function closeIssue(issueNumber: number) {
  await fetch(
    `https://api.github.com/repos/${REPO}/issues/${issueNumber}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: "closed" }),
    }
  );
}

async function commentIssue(issueNumber: number, comment: string) {
  await fetch(
    `https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: comment }),
    }
  );
}
