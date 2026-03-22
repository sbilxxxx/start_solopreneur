import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CategoryFilter from "./CategoryFilter";

const categoryLabel: Record<string, string> = {
  engineering: "エンジニアリング",
  business: "経営",
  finance: "財務",
  marketing: "マーケ",
};

const categoryColor: Record<string, string> = {
  engineering: "bg-blue-50 text-blue-700 border-blue-200",
  business: "bg-emerald-50 text-emerald-700 border-emerald-200",
  finance: "bg-amber-50 text-amber-700 border-amber-200",
  marketing: "bg-purple-50 text-purple-700 border-purple-200",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Nav current="blog" />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-3">Blog</p>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">学びの記録</h1>
        <p className="text-sm text-zinc-400 mb-10">
          AI × ソロアントレプレナーとしての実験・気づき・失敗を記録する。
        </p>

        <Suspense>
          <CategoryFilter current={category ?? ""} />
        </Suspense>

        {posts.length === 0 ? (
          <p className="text-sm text-zinc-400">
            {category ? "このカテゴリーの記事はまだありません。" : "記事を準備中です。"}
          </p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-zinc-400 font-mono">{post.date}</span>
                  <span className={`text-xs border rounded-full px-2 py-0.5 ${categoryColor[post.category]}`}>
                    {categoryLabel[post.category]}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                  {post.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{post.summary}</p>
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
