import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Nav current="blog" />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-zinc-400 font-mono">{post.date}</span>
            <span className={`text-xs border rounded-full px-2 py-0.5 ${categoryColor[post.category]}`}>
              {categoryLabel[post.category]}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
            {post.summary}
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none
          prose-headings:font-semibold
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400
          prose-li:text-zinc-600 dark:prose-li:text-zinc-400
          prose-code:text-sm prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-zinc-950 prose-pre:text-zinc-100
          prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200
          prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <MDXRemote
            source={post.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <a href="/blog" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
            ← 記事一覧に戻る
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
