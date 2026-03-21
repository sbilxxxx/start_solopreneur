import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;
const REPO = "sbilxxxx/start_solopreneur";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // ボタン押下（承認/却下）
  if (body.callback_query) {
    await handleCallbackQuery(body.callback_query);
    return NextResponse.json({ ok: true });
  }

  // テキストメッセージ
  if (body.message?.text) {
    await handleTextMessage(body.message);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

// ─── テキストコマンドルーティング ──────────────────────────────────────────

async function handleTextMessage(message: {
  chat: { id: number };
  text: string;
}) {
  const chatId = message.chat.id;
  const text = message.text.trim();

  if (text === "/start" || text === "/help" || text === "ヘルプ") {
    await sendMessage(
      chatId,
      `🤖 <b>使えるコマンド一覧</b>\n\n` +
        `/status — プロジェクトの現在状況を確認\n` +
        `記事 [トピック] — 記事執筆タスクをキューに追加\n` +
        `投稿補充 — X投稿ストックの補充をキューに追加\n` +
        `承認 [N] — Issue #N を承認してclose\n` +
        `却下 [N] — Issue #N を却下（コメント追加）\n\n` +
        `ボタン付きメッセージが届いたら✅/❌ボタンでも承認・却下できます。`,
      "HTML"
    );
    return;
  }

  if (text === "/status" || text === "状況" || text === "ステータス") {
    await sendMessage(chatId, "⏳ プロジェクトの状況を確認中...");
    const summary = await getProjectStatus();
    await sendMessage(chatId, summary, "HTML");
    return;
  }

  const articleMatch = text.match(/^記事\s+(.+)$/);
  if (articleMatch) {
    const topic = articleMatch[1];
    const issueNumber = await createGitHubIssue(
      `[editorial] 記事執筆: ${topic}`,
      `Telegramから依頼された記事執筆タスク。\n\n**トピック:** ${topic}\n\n次回のmanager-agent実行時に処理されます。`,
      ["editorial", "telegram"]
    );
    await sendMessage(
      chatId,
      `📝 記事執筆タスクをキューに追加しました。\nIssue #${issueNumber}: 「${topic}」\n\n次回のmanager-agent実行（毎朝9時）時に処理されます。`
    );
    return;
  }

  if (text === "投稿補充" || text === "ツイート補充") {
    const issueNumber = await createGitHubIssue(
      "[marketing] X投稿ストック補充",
      "Telegramから依頼されたX投稿ストック補充タスク。\n\n次回のmanager-agent実行時に処理されます。",
      ["marketing", "telegram"]
    );
    await sendMessage(
      chatId,
      `📣 投稿補充タスクをキューに追加しました。\nIssue #${issueNumber}\n\n次回のmanager-agent実行（毎朝9時）時に処理されます。`
    );
    return;
  }

  const approveMatch = text.match(/^承認\s*#?(\d+)$/);
  if (approveMatch) {
    const issueNumber = parseInt(approveMatch[1]);
    await closeIssue(issueNumber);
    await sendMessage(
      chatId,
      `✅ Issue #${issueNumber} を承認しました。次回のmanager-agent実行時に処理されます。`
    );
    return;
  }

  const rejectMatch = text.match(/^却下\s*#?(\d+)$/);
  if (rejectMatch) {
    const issueNumber = parseInt(rejectMatch[1]);
    await commentIssue(issueNumber, "❌ 却下しました（Telegramから）");
    await sendMessage(
      chatId,
      `❌ Issue #${issueNumber} を却下しました。理由があればGitHubにコメントしてください。`
    );
    return;
  }

  // 未知のコマンド
  await sendMessage(
    chatId,
    `❓ コマンドが認識できませんでした。\n/help でコマンド一覧を確認してください。`
  );
}

// ─── プロジェクト状況サマリー（Claude Haiku） ──────────────────────────────

async function getProjectStatus(): Promise<string> {
  try {
    // GitHub API でオープンIssueを取得
    const issuesRes = await fetch(
      `https://api.github.com/repos/${REPO}/issues?state=open&per_page=10`,
      {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      }
    );
    const issues = issuesRes.ok ? await issuesRes.json() : [];

    const issueList =
      Array.isArray(issues) && issues.length > 0
        ? issues
            .map(
              (i: { number: number; title: string }) =>
                `- #${i.number}: ${i.title}`
            )
            .join("\n")
        : "（オープンIssueなし）";

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `以下のGitHub Issueリストをもとに、プロジェクトの現在状況を3〜5行で簡潔にまとめてください。日本語で。\n\n${issueList}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return `📊 <b>プロジェクト状況</b>\n\n${text}\n\n<b>オープンIssue:</b>\n${issueList}`;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return `❗ 状況取得に失敗しました: ${msg}`;
  }
}

// ─── ボタン（callback_query）処理 ─────────────────────────────────────────

async function handleCallbackQuery(callbackQuery: {
  id: string;
  data: string;
  from: { id: number };
}) {
  const { id: callbackId, data, from } = callbackQuery;
  const [action, issueNumberStr] = data.split(":");
  const issueNumber = parseInt(issueNumberStr);

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
}

// ─── Telegram API ──────────────────────────────────────────────────────────

async function answerCallback(callbackQueryId: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  });
}

async function sendMessage(
  chatId: number,
  text: string,
  parseMode?: "HTML" | "Markdown"
) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...(parseMode && { parse_mode: parseMode }),
    }),
  });
}

// ─── GitHub API ────────────────────────────────────────────────────────────

async function createGitHubIssue(
  title: string,
  body: string,
  labels: string[]
): Promise<number> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, labels }),
  });
  const data = await res.json();
  return data.number;
}

async function closeIssue(issueNumber: number) {
  await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state: "closed" }),
  });
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
