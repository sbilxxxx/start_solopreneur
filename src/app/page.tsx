import { getAllPosts } from "@/lib/posts";
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

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Nav />

      <main className="max-w-3xl mx-auto px-6">

        {/* Hero */}
        <section className="py-20 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-6">Claude Code × Solo Entrepreneur</p>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-6">
            Claude Codeで、<br />一人で会社を動かせるか？
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl mb-8">
            AIを使いながらゼロからソロアントレを始める実験を、失敗も含めてすべて記録しています。
            コードをほぼ書かず、会話だけでサイトを作った話から始まります。
          </p>
          <a
            href="/blog"
            className="inline-block bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            記事を読む →
          </a>
        </section>

        {/* About strip */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0 flex items-center justify-center text-zinc-500 dark:text-zinc-300 font-bold text-xl">
              B
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Ben について</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                大学でAIを学び、会社勤めをしながら「AIを本当に使いこなせば、一人でも会社を動かせるはず」と思い立ち、ソロアントレとして始動しました。
                このサイトはその実験の全記録です。
              </p>
              <a href="/about" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
                もっと読む →
              </a>
            </div>
          </div>
        </section>

        {/* Latest posts */}
        <section className="py-14 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">最新記事</h2>
            <a href="/blog" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">すべて見る →</a>
          </div>
          {posts.length === 0 ? (
            <p className="text-sm text-zinc-400">記事を準備中です。</p>
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
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{post.summary}</p>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Topics */}
        <section className="py-14 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">テーマ</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { ja: "Claude Code入門", en: "engineering", desc: "初心者が実際に使った記録。失敗も全部。", color: "bg-blue-50 border-blue-200 text-blue-800" },
              { ja: "ソロアントレ実録", en: "business", desc: "数値・進捗・意思決定の記録。月次レポートも。", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
              { ja: "一人会社の作り方", en: "finance", desc: "ツール・仕組み・コスト設計の記録。", color: "bg-amber-50 border-amber-200 text-amber-800" },
              { ja: "マーケ実験", en: "marketing", desc: "X運用・コンテンツ戦略の試行錯誤。", color: "bg-purple-50 border-purple-200 text-purple-800" },
            ].map((t) => (
              <a
                key={t.en}
                href={`/blog?category=${t.en}`}
                className={`border rounded-xl p-4 hover:shadow-sm transition-shadow ${t.color}`}
              >
                <div className="font-semibold text-sm mb-1">{t.ja}</div>
                <div className="text-xs opacity-60 leading-relaxed">{t.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* X CTA */}
        <section className="py-14">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            記事のあいだの気づきや失敗は、Xにリアルタイムで投稿しています。
          </p>
          <a
            href="https://x.com/bensolopreneur"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-lg hover:border-zinc-400 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.906-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @bensolopreneur をフォロー
          </a>
        </section>

      </main>

      <Footer />
    </div>
  );
}
