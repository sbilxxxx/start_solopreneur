import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getRelevantContext } from "@/lib/rag";
import type Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // 最新のユーザーメッセージからRAGコンテキストを取得
  const lastUserMessage = [...messages]
    .reverse()
    .find((m: Anthropic.MessageParam) => m.role === "user");
  const query =
    typeof lastUserMessage?.content === "string"
      ? lastUserMessage.content
      : "";

  const context = query ? await getRelevantContext(query) : "";

  const systemPrompt = [
    `あなたは「Start Solopreneur」サイトのAIアシスタントです。`,
    `このサイトはClaude Codeを使いながらソロアントレプレナーとして活動する実験記録を発信しています。`,
    `エンジニアリング・経営・マーケティング・財務について、実践的かつ簡潔に答えてください。`,
    `回答は日本語で、200文字以内を目安にしてください。`,
    context
      ? `\n## 参考記事\n\n${context}\n\n上記の記事内容も参考にして回答してください。`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const messageStream = anthropic.messages.stream({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages as Anthropic.MessageParam[],
      });

      for await (const event of messageStream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
