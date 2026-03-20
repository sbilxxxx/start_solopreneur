const roadmap = [
  {
    phase: "Phase 1",
    status: "done",
    title: "基礎 + CLAUDE.md + Hooks",
    titleEn: "Basics · Persistent Rules · Automation Triggers",
    desc: "ファイル操作・デプロイ・全社方針の定義・自動git push。",
    claudeFeatures: ["CLAUDE.md", "Hooks（Stopフック）"],
    deliverables: ["ホーム・About", "Vercel自動デプロイ", "タスク管理"],
  },
  {
    phase: "Phase 2",
    status: "current",
    title: "会社組織化 + Skills + MCP",
    titleEn: "Company Structure · Agent Roles · External Tools",
    desc: "ディレクトリを会社として機能させ、AIに役割を与える。",
    claudeFeatures: ["Skills（役割定義）", "MCP（GitHub・Figma）"],
    deliverables: ["content/marketing/finance/", "ブログ機能（MDX）", "Nav共通化"],
  },
  {
    phase: "Phase 3",
    status: "upcoming",
    title: "データ連携 + Subagents + 外部API",
    titleEn: "Data Integration · Specialist Workers · External APIs",
    desc: "専門ワーカーへ分業し、外部データをサイトに流し込む。",
    claudeFeatures: ["Subagents（専門ワーカー）"],
    deliverables: ["KPIダッシュボード", "Google Analytics連携", "i18n（日英）"],
  },
  {
    phase: "Phase 4",
    status: "upcoming",
    title: "AI機能実装 + Agent Teams",
    titleEn: "AI Features · Parallel Collaboration",
    desc: "サイト自体がAIを持ち、複数エージェントが協調する。",
    claudeFeatures: ["Agent Teams（並列協調）", "Anthropic SDK"],
    deliverables: ["チャット・RAG", "記事要約", "日英自動翻訳"],
  },
  {
    phase: "Phase 5",
    status: "upcoming",
    title: "完全自動化 + Plugins",
    titleEn: "Full Automation · Bundled Workflows",
    desc: "寝ている間も動くシステム。機能をプラグインとして再利用・配布。",
    claudeFeatures: ["Plugins（バンドル）", "高度なHooks"],
    deliverables: ["コンテンツ自動生成", "Slack通知", "自作プラグイン"],
  },
  {
    phase: "Phase 6",
    status: "upcoming",
    title: "収益化",
    titleEn: "Monetization",
    desc: "システムがお金を生む。エンジニアリングをキャッシュポイントに接続。",
    claudeFeatures: [],
    deliverables: ["Stripe決済", "ニュースレター", "AIアナリティクス"],
  },
];

const departments = [
  { dir: "src/", role: "開発部", desc: "Next.js アプリ本体", color: "text-blue-600 dark:text-blue-400" },
  { dir: "content/", role: "編集部", desc: "ブログ記事（MDX）", color: "text-emerald-600 dark:text-emerald-400" },
  { dir: "marketing/", role: "広報部", desc: "戦略・SNSテンプレ", color: "text-purple-600 dark:text-purple-400" },
  { dir: "finance/", role: "財務部", desc: "収益モデル・試算", color: "text-amber-600 dark:text-amber-400" },
  { dir: "notes/", role: "社長メモ", desc: "意思決定・アイデア", color: "text-zinc-500 dark:text-zinc-400" },
  { dir: "tasks/", role: "タスク管理", desc: "スプリント・バックログ", color: "text-zinc-500 dark:text-zinc-400" },
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
            AI開発エンジニアがソロアントレプレナーとして、
            <strong className="text-zinc-700 dark:text-zinc-300"> Claude Code × マルチエージェント × 外部API </strong>
            を武器に、技術・経営・財務・マーケを一人で回す方法を実験・記録するサイトです。
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            A live experiment — using AI agents, MCP, and automation to achieve team-level output as an individual.
          </p>
        </section>

        {/* Company Structure */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">このプロジェクトの全体像</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            ディレクトリ＝会社組織。各フォルダが部門であり、AIエージェントがそれぞれの担当者として機能する。
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-5 font-mono text-sm mb-4">
            <div className="text-zinc-400 text-xs mb-3">start_solopreneur/</div>
            <div className="text-xs mb-2">
              <span className="text-zinc-300 dark:text-zinc-600">├── </span>
              <span className="text-zinc-600 dark:text-zinc-300">CLAUDE.md</span>
              <span className="text-zinc-400 text-xs ml-2">← 社長指示書（AI自動読込）</span>
            </div>
            {departments.map((d, i) => (
              <div key={d.dir} className="text-xs mb-1">
                <span className="text-zinc-300 dark:text-zinc-600">{i === departments.length - 1 ? "└── " : "├── "}</span>
                <span className={`font-semibold ${d.color}`}>{d.dir}</span>
                <span className="text-zinc-400 ml-2">← {d.role}：{d.desc}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">6</div>
              <div className="text-xs text-zinc-400">学習フェーズ</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">1人</div>
              <div className="text-xs text-zinc-400">チーム並みのアウトプット</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">¥0</div>
              <div className="text-xs text-zinc-400">インフラコスト（現時点）</div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">学習ロードマップ</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Claude Code 拡張機能（CLAUDE.md・Skills・Subagents・Agent Teams・Plugins）を各フェーズに組み込みながら習得する。
          </p>
          <div className="space-y-3">
            {roadmap.map((item) => (
              <div
                key={item.phase}
                className={`rounded-xl border p-4 ${
                  item.status === "current"
                    ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                    : item.status === "done"
                    ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/30 opacity-60"
                    : "border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                      item.status === "current"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : item.status === "done"
                        ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                        : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                    }`}>
                      {item.status === "done" ? "✓" : item.phase.replace("Phase ", "P")}
                    </span>
                    {item.status === "current" && (
                      <span className="text-xs text-blue-500 font-medium whitespace-nowrap">今ここ</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{item.title}</span>
                      {item.status === "done" && <span className="text-xs text-zinc-400">完了</span>}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">{item.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.claudeFeatures.map((f) => (
                        <span key={f} className="text-xs bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-md px-2 py-0.5">
                          {f}
                        </span>
                      ))}
                      {item.deliverables.map((d) => (
                        <span key={d} className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 rounded-md px-2 py-0.5">
                          {d}
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
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">発信トピック</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            技術だけでなく、ソロアントレプレナーとして必要な4軸を横断して発信する。
          </p>
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
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Latest Posts</h2>
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
