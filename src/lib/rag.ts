import { anthropic } from "./anthropic";
import { getAllPosts, getPostBySlug } from "./posts";

/**
 * クエリに関連するブログ記事を選択してコンテキストとして返す。
 * 外部ベクトルDBは使わず、Claude Haikuで記事を選択する軽量RAG。
 */
export async function getRelevantContext(query: string): Promise<string> {
  const posts = getAllPosts();
  if (posts.length === 0) return "";

  const postList = posts
    .map((p) => `slug: ${p.slug} | ${p.title} — ${p.summary}`)
    .join("\n");

  const selectionResponse = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `以下のブログ記事一覧から、質問「${query}」に関連する記事のslugを最大2つ選んでください。
関連する記事がなければ "none" と返してください。slugのみをカンマ区切りで返してください。

${postList}`,
      },
    ],
  });

  const selected =
    selectionResponse.content[0].type === "text"
      ? selectionResponse.content[0].text.trim()
      : "";

  if (!selected || selected === "none") return "";

  const slugs = selected
    .split(",")
    .map((s) => s.trim())
    .slice(0, 2);

  const contexts: string[] = [];
  for (const slug of slugs) {
    const post = getPostBySlug(slug);
    if (post) {
      // 記事本文は先頭2000文字に絞る（コスト削減）
      contexts.push(`## ${post.title}\n\n${post.content.slice(0, 2000)}`);
    }
  }

  return contexts.join("\n\n---\n\n");
}
