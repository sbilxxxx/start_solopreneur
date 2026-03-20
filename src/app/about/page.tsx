const timeline = [
  {
    year: "2020",
    ja: "AIエンジニアとしてキャリアスタート。Pythonでの機械学習・LLM開発に従事。",
    en: "Started career as an AI engineer. Focused on ML and LLM development with Python.",
  },
  {
    year: "2024",
    ja: "Claude CodeなどのAIツールに本格的に触れ始め、開発スタイルが変化。",
    en: "Began exploring AI tools like Claude Code, transforming my development workflow.",
  },
  {
    year: "2025",
    ja: "ソロアントレプレナーとしての活動を開始。エンジニアリング × 経営 × マーケを統合。",
    en: "Started solo entrepreneurship journey, integrating engineering, business, and marketing.",
  },
  {
    year: "2026",
    ja: "このサイトを通じて学びを発信しながら、AIで動くビジネスを構築中。",
    en: "Building AI-driven businesses while sharing learnings through this site.",
  },
];

const skills = [
  { label: "AI / LLM 開発", sub: "Python, LangChain, Anthropic SDK" },
  { label: "Claude Code", sub: "マルチエージェント, MCP, 自動化" },
  { label: "経営・財務", sub: "ソロアントレ, CFO思考, 意思決定" },
  { label: "マーケ", sub: "コンテンツ, SEO, グロース" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:opacity-70 transition-opacity">
            My Site
          </a>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="/about" className="text-zinc-900 dark:text-zinc-100 font-medium">About</a>
            <a href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Blog</a>
            <a href="/projects" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Projects</a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <section className="py-16 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-sm text-zinc-400 uppercase tracking-wide mb-3">About</p>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            AIエンジニア × ソロアントレプレナー
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
            Python と LLM を使ったAI開発をメインにしてきたエンジニアです。
            技術だけでなく、経営・財務・マーケも自分でこなすソロアントレプレナーとして、
            「一人でチーム並みのアウトプットを出す」ことを目指しています。
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
            An AI engineer specializing in Python and LLMs, now operating as a solo entrepreneur.
            My goal is to combine engineering with business, finance, and marketing —
            achieving team-level output as an individual using AI tools like Claude Code.
          </p>
        </section>

        {/* Skills */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-6">Skills & Focus</h2>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.label} className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-1">{skill.label}</div>
                <div className="text-xs text-zinc-400">{skill.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-8">Journey</h2>
          <div className="space-y-8">
            {timeline.map((item) => (
              <div key={item.year} className="flex gap-6">
                <div className="text-sm font-mono text-zinc-400 w-12 shrink-0 pt-0.5">{item.year}</div>
                <div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-1">{item.ja}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* This site */}
        <section className="py-12">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">このサイトについて</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
            このサイト自体が実験場です。Claude Code を使いながら作り、
            マルチエージェント・MCP・外部API連携・自動化など、
            ソロアントレプレナーとして必要な最先端のスキルを習得するプロセスを記録しています。
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This site is itself an experiment — built with Claude Code while learning
            multi-agent workflows, MCP, API integrations, and automation.
          </p>
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
