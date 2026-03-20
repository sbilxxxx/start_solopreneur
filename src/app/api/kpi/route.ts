import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600; // 1時間キャッシュ

export async function GET() {
  const [xData, articleCount] = await Promise.allSettled([
    fetchXFollowers(),
    fetchArticleCount(),
  ]);

  return NextResponse.json({
    x: xData.status === "fulfilled" ? xData.value : { followers: null, error: true },
    articles: articleCount.status === "fulfilled" ? articleCount.value : { count: null, error: true },
    updatedAt: new Date().toISOString(),
  });
}

async function fetchXFollowers() {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });

  const user = await client.v2.userByUsername("bensolopreneur", {
    "user.fields": ["public_metrics"],
  });

  return {
    followers: user.data.public_metrics?.followers_count ?? null,
    following: user.data.public_metrics?.following_count ?? null,
    tweets: user.data.public_metrics?.tweet_count ?? null,
  };
}

async function fetchArticleCount() {
  const posts = getAllPosts();
  return { count: posts.length };
}
