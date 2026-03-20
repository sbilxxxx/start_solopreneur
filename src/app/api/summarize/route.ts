import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getPostBySlug } from "@/lib/posts";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `以下のブログ記事を日本語で3文以内に要約してください。読者はソロアントレプレナー志望のエンジニアです。\n\n# ${post.title}\n\n${post.content}`,
      },
    ],
  });

  const summary =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ summary });
}
