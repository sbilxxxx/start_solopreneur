const categories = [
  {
    name: "Engineering",
    nameJa: "エンジニアリング",
    description: "AI / Web / Claude Code",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    name: "Business",
    nameJa: "経営",
    description: "ソロアントレ / 意思決定 / 組織",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    name: "Finance",
    nameJa: "財務",
    description: "CFO思考 / 投資 / キャッシュフロー",
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    name: "Marketing",
    nameJa: "マーケ",
    description: "コンテンツ / SEO / グロース",
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">My Site</span>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">About</a>
            <a href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Blog</a>
            <a href="/projects" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Projects</a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6">
        {/* Hero */}
        <section className="py-20">
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-3 tracking-wide uppercase">Engineer × Solo Entrepreneur</p>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-6">
            AIで動かす、<br />一人会社の作り方
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
            AI開発エンジニアがソロアントレプレナーとして、技術・経営・財務・マーケを横断しながら学ぶ記録です。
            Claude Codeを使いこなし、一人でチーム並みのアウトプットを目指します。
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-3 leading-relaxed max-w-xl">
            A journal of an AI engineer navigating solo entrepreneurship — engineering, business, finance, and marketing.
          </p>
        </section>

        {/* Categories */}
        <section className="pb-16">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-6">Topics</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`/blog?category=${cat.name.toLowerCase()}`}
                className={`border rounded-xl p-5 hover:shadow-sm transition-shadow ${cat.color}`}
              >
                <div className="font-semibold text-base mb-1">{cat.nameJa}</div>
                <div className="text-xs font-normal opacity-80">{cat.name}</div>
                <div className="text-xs mt-2 opacity-70">{cat.description}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Latest posts placeholder */}
        <section className="pb-20 border-t border-zinc-100 dark:border-zinc-800 pt-12">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-6">Latest Posts</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start animate-pulse">
                <div className="w-16 h-4 bg-zinc-100 dark:bg-zinc-800 rounded mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-50 dark:bg-zinc-900 rounded w-1/2" />
                </div>
              </div>
            ))}
            <p className="text-sm text-zinc-400 pt-2">記事を準備中です — Coming soon</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-zinc-400">
          <span>© 2026 My Site</span>
          <div className="flex gap-4">
            <a href="/en" className="hover:text-zinc-600 transition-colors">English</a>
            <a href="/" className="hover:text-zinc-600 transition-colors">日本語</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
