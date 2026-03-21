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
        `/status — タスク・Issueの現在状況を確認\n` +
        `指示: [内容] — Claude Codeに開発指示を出す\n` +
        `記事 [トピック] — 記事執筆タスクをキューに追加\n` +
        `投稿補充 — X投稿ストックの補充をキューに追加\n` +
        `承認 [N] — Issue #N を承認してclose\n` +
        `却下 [N] — Issue #N を却下（コメント追加）\n\n` +
        `<b>指示の例:</b>\n` +
        `<code>指示: ChatWidgetのボタンの色を青に変えて</code>\n` +
        `<code>指示: About页のプロフィール文を更新して</code>\n\n` +
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

  // 指示コマンド（「指示: 〜」または「実行: 〜」）
  const instructionMatch = text.match(/^(?:指示|実行)[:\s：]\s*(.+)$/s);
  if (instructionMatch) {
    const instruction = instructionMatch[1].trim();
    const issueNumber = await createGitHubIssue(
      `[instruction] ${instruction.slice(0, 60)}`,
      instruction,
      ["instruction", "telegram"]
    );
    await sendMessage(
      chatId,
      `⚙️ 指示をキューに追加しました。\nIssue #${issueNumber}\n\n次回の自動チェック（30分以内）で実行されます。\n\n即時実行したい場合はPCで:\n<code>npm run agents:instruction</code>`,
      "HTML"
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
  const headers = { Authorization: `Bearer ${GITHUB_TOKEN}` };

  // tasks/current.md を GitHub APIで取得し、未完了TODOを抽出
  let todoLines: string[] = [];
  try {
    const fileRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/tasks/current.md`,
      { headers }
    );
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      const content = Buffer.from(fileData.content, "base64").toString("utf-8");
      todoLines = content
        .split("\n")
        .filter((l) => l.match(/^- \[ \]/))
        .map((l) => "• " + l.replace(/^- \[ \] \*\*(.+?)\*\*.*/, "$1").replace(/^- \[ \] /, ""))
        .slice(0, 8);
    }
  } catch { /* 取得失敗はスキップ */ }

  // オープンIssueを取得
  let issueLines: string[] = [];
  try {
    const issuesRes = await fetch(
      `https://api.github.com/repos/${REPO}/issues?state=open&per_page=8`,
      { headers }
    );
    if (issuesRes.ok) {
      const issues = await issuesRes.json();
      if (Array.isArray(issues)) {
        issueLines = issues.map(
          (i: { number: number; title: string }) => `• #${i.number}: ${i.title}`
        );
      }
    }
  } catch { /* 取得失敗はスキップ */ }

  let msg = `📊 <b>プロジェクト状況</b>\n\n`;

  if (todoLines.length > 0) {
    msg += `📋 <b>未完了タスク（tasks/current.md）</b>\n${todoLines.join("\n")}\n\n`;
  } else {
    msg += `📋 <b>未完了タスク</b>\nなし\n\n`;
  }

  if (issueLines.length > 0) {
    msg += `🐛 <b>オープンIssue</b>\n${issueLines.join("\n")}`;
  } else {
    msg += `🐛 <b>オープンIssue</b>\nなし`;
  }

  return msg;
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
