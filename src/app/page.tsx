import { getAllPosts } from "@/lib/posts";

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

const values = [
  {
    title: "AIを「使う」から「使いこなす」へ",
    desc: "ChatGPTで質問するレベルから、エージェントに仕事を任せるレベルまで。Claude Codeの実践的な活用法を記録する。",
  },
  {
    title: "エンジニアリングだけで終わらない",
    desc: "技術を作るだけでなく、それをビジネスに繋げる。経営・財務・マーケも横断して、一人で会社を動かす方法を探る。",
  },
  {
    title: "完成品より「やってみた記録」",
    desc: "うまくいったことだけでなく、失敗・試行錯誤・気づきをそのまま書く。再現性のある学びにすることを目指す。",
  },
];

const topics = [
  {
    nameJa: "エンジニアリング",
    nameEn: "Engineering",
    desc: "Claude Code・AI開発・Webの実装記録",
    color: "bg-blue-50 border-blue-200 text-blue-800",
  },
  {
    nameJa: "経営",
    nameEn: "Business",
    desc: "ソロアントレとしての意思決定・組織設計",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
  },
  {
    nameJa: "財務",
    nameEn: "Finance",
    desc: "CFO思考・コスト管理・収益モデルの試算",
    color: "bg-amber-50 border-amber-200 text-amber-800",
  },
  {
    nameJa: "マーケ",
    nameEn: "Marketing",
    desc: "コンテンツ戦略・SEO・グロースの実験",
    color: "bg-purple-50 border-purple-200 text-purple-800",
  },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">Start Solopreneur</span>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">About</a>
            <a href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Blog</a>
            <a href="/projects" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Projects</a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6">

        {/* Hero */}
        <section className="py-20 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-4">Engineer × Solo Entrepreneur</p>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-6">
            AIで動かす、<br />一人会社の作り方
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mb-3">
            AI開発エンジニアがソロアントレプレナーとして、
            技術・経営・財務・マーケを一人で回す方法を実験・記録するサイトです。
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            A live journal of an AI engineer navigating solo entrepreneurship —
            building systems where AI handles the work, and humans make the decisions.
          </p>
        </section>

        {/* Value propositions */}
        <section className="py-14 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">このサイトで学べること</h2>
          <div className="space-y-6">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="w-1 shrink-0 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                <div>
                  <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">{v.title}</div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest posts */}
        <section className="py-14 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Latest Posts</h2>
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
        <section className="py-14">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">Topics</h2>
          <div className="grid grid-cols-2 gap-3">
            {topics.map((t) => (
              <a
                key={t.nameEn}
                href={`/blog?category=${t.nameEn.toLowerCase()}`}
                className={`border rounded-xl p-4 hover:shadow-sm transition-shadow ${t.color}`}
              >
                <div className="font-semibold text-sm mb-0.5">{t.nameJa}</div>
                <div className="text-xs opacity-70 mb-2">{t.nameEn}</div>
                <div className="text-xs opacity-60 leading-relaxed">{t.desc}</div>
              </a>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-zinc-400">
          <span>© 2026 Start Solopreneur</span>
          <div className="flex gap-4">
            <a href="/en" className="hover:text-zinc-600 transition-colors">English</a>
            <a href="/" className="hover:text-zinc-600 transition-colors">日本語</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
