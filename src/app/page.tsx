const roadmap = [
  {
    phase: "Phase 1",
    status: "current",
    title: "基礎：Claude Code 単体操作",
    titleEn: "Claude Code Basics",
    desc: "ファイル作成・編集・コマンド実行。このサイト自体を会話で作る。",
    skills: ["Edit / Write / Bash ツール", "Next.js ルーティング", "Vercel デプロイ"],
  },
  {
    phase: "Phase 2",
    status: "upcoming",
    title: "MCP：外部ツールとの連携",
    titleEn: "MCP Integration",
    desc: "Claude に GitHub・Figma などの操作権限を渡す。",
    skills: ["GitHub MCP", "Figma MCP", "Filesystem MCP"],
  },
  {
    phase: "Phase 3",
    status: "upcoming",
    title: "外部API：サイトに動的データを注入",
    titleEn: "External API Integration",
    desc: "PV・収益・SNSフォロワーをリアルタイムで可視化する。",
    skills: ["Google Analytics API", "環境変数管理", "Webhook 実装"],
  },
  {
    phase: "Phase 4",
    status: "upcoming",
    title: "AI機能実装：サイト自体にAIを組み込む",
    titleEn: "AI-Powered Features",
    desc: "Claude API でサイト内チャット・記事要約・RAG 検索を実装。",
    skills: ["Anthropic SDK", "Streaming レスポンス", "RAG"],
  },
  {
    phase: "Phase 5",
    status: "upcoming",
    title: "マルチエージェント：複数AIの分業",
    titleEn: "Multi-Agent Workflows",
    desc: "リサーチ・執筆・SEOチェックを別々のエージェントに分担させる。",
    skills: ["サブエージェント起動", "並列実行", "エージェント間データ連携"],
  },
  {
    phase: "Phase 6",
    status: "upcoming",
    title: "自動化：人間が介在しないワークフロー",
    titleEn: "Full Automation",
    desc: "Hooks + スケジュール実行で、寝ている間も動くシステムを作る。",
    skills: ["Claude Code Hooks", "スケジュール実行", "Slack 通知"],
  },
  {
    phase: "Phase 7",
    status: "upcoming",
    title: "収益化：システムがお金を生む",
    titleEn: "Monetization",
    desc: "Stripe・メール配信・アナリティクスを繋ぎ、ビジネスとして機能させる。",
    skills: ["Stripe API", "Resend（メール）", "AI アナリティクス"],
  },
];

const topics = [
  { nameJa: "エンジニアリング", nameEn: "Engineering", desc: "AI / Web / Claude Code", color: "bg-blue-50 border-blue-200 text-blue-800" },
  { nameJa: "経営", nameEn: "Business", desc: "ソロアントレ / 意思決定", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { nameJa: "財務", nameEn: "Finance", desc: "CFO思考 / キャッシュフロー", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { nameJa: "マーケ", nameEn: "Marketing", desc: "コンテンツ / SEO / グロース", color: "bg-purple-50 border-purple-200 text-purple-800" },
];

export default function Home() {
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
        <section className="py-16 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-4">Engineer × Solo Entrepreneur</p>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-5">
            AIで動かす、<br />一人会社の作り方
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mb-2">
            AI開発エンジニアがソロアントレプレナーとして、<strong className="text-zinc-700 dark:text-zinc-300">Claude Code × マルチエージェント × 外部API</strong> を武器に、
            技術・経営・財務・マーケを一人で回す方法を実験・記録するサイトです。
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            A live experiment in solo entrepreneurship — using AI agents, MCP, and automation to
            achieve team-level output as an individual.
          </p>
        </section>

        {/* Project Vision */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">このプロジェクトの全体像</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">7</div>
              <div className="text-xs text-zinc-400">学習フェーズ</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">1人</div>
              <div className="text-xs text-zinc-400">チーム並みのアウトプット</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">¥0</div>
              <div className="text-xs text-zinc-400">インフラコスト（現時点）</div>
            </div>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            このサイト自体が実験場です。<strong className="text-zinc-700 dark:text-zinc-300">Phase 1（今ここ）</strong> から始まり、
            MCP・外部API・AI機能・マルチエージェント・自動化・収益化へと段階的に進化させていきます。
            全フェーズを通じて「ソロアントレプレナーがAIをどう使いこなすか」を記録します。
          </p>
        </section>

        {/* Roadmap */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">学習ロードマップ</h2>
          <div className="space-y-4">
            {roadmap.map((item) => (
              <div
                key={item.phase}
                className={`rounded-xl border p-5 ${
                  item.status === "current"
                    ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                    : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                      item.status === "current"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                    }`}>
                      {item.phase}
                    </span>
                    {item.status === "current" && (
                      <span className="text-xs text-blue-500 font-medium">← 今ここ</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">{item.title}</div>
                    <div className="text-xs text-zinc-400 mb-2">{item.titleEn}</div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((s) => (
                        <span key={s} className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 rounded-md px-2 py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Topics */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">発信トピック</h2>
          <div className="grid grid-cols-2 gap-3">
            {topics.map((t) => (
              <a
                key={t.nameEn}
                href={`/blog?category=${t.nameEn.toLowerCase()}`}
                className={`border rounded-xl p-4 hover:shadow-sm transition-shadow ${t.color}`}
              >
                <div className="font-semibold text-sm mb-0.5">{t.nameJa}</div>
                <div className="text-xs opacity-70">{t.nameEn}</div>
                <div className="text-xs mt-2 opacity-60">{t.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Latest posts */}
        <section className="py-12">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">Latest Posts</h2>
          <p className="text-sm text-zinc-400">記事を準備中です — Coming soon</p>
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
