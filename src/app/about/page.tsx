import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Nav current="about" />

      <main className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <section className="py-16 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0 flex items-center justify-center text-zinc-500 dark:text-zinc-300 font-bold text-2xl">
              B
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Ben</h1>
              <p className="text-sm text-zinc-400">@bensolopreneur</p>
            </div>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            大学でAIを学び、会社勤めをしながら「Claude Codeを使えば、一人でも会社を動かせるんじゃないか」と思い始め、
            ソロアントレプレナーとして動き出したのが2026年のことです。
          </p>
        </section>

        {/* Story */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">このサイトを始めた理由</h2>
          <div className="space-y-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              AIを学んでいると、「これは自分一人でもかなりのことができるな」と感じる瞬間が増えてきました。
              コードを書かなくてもサイトが作れる。戦略を考えてくれるエージェントが動く。
              財務の試算も、マーケの文章も、AIに頼める。
            </p>
            <p>
              ただ、「使えます」と「使いこなせています」はまったく別の話です。
              実際にビジネスとして動かすには、技術だけじゃなく経営・財務・マーケの感覚も必要で、
              それを一人でどう回すかは、やってみないとわからない。
            </p>
            <p>
              だから始めました。実験として、記録として。
              うまくいったことだけでなく、失敗・コスト・迷ったこともそのまま書いています。
              同じように「AIを使ってなにかやりたい」と思っている人に、少しでも参考になればと思っています。
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">これまでの経緯</h2>
          <div className="space-y-8">
            {[
              {
                year: "大学時代",
                text: "情報系の学部でAIを学ぶ。機械学習・自然言語処理の基礎を習得。コーディングは授業で触れた程度で、本格的な開発経験はなし。",
              },
              {
                year: "就職後",
                text: "会社勤めをしながらPythonでのAI開発・LLM活用に携わる。この頃からClaude CodeなどのAIコーディングツールを使い始め、開発スタイルが変わっていく。",
              },
              {
                year: "2026年〜",
                text: "「AIを本当に使いこなせば、一人で会社を動かせる」という仮説を検証するためにこのサイトを立ち上げ、ソロアントレプレナーとして始動。現在進行中。",
              },
            ].map((item) => (
              <div key={item.year} className="flex gap-6">
                <div className="text-xs font-mono text-zinc-400 w-20 shrink-0 pt-0.5 leading-relaxed">{item.year}</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What I write about */}
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">発信していること</h2>
          <div className="space-y-4">
            {[
              {
                label: "Claude Code入門",
                text: "初心者が実際に使ってみた記録。詰まったところ・失敗したことも全部書きます。",
                color: "text-blue-700 bg-blue-50 border-blue-200",
              },
              {
                label: "ソロアントレ実録",
                text: "PV・費用・収益など数字も含めた月次レポート。かっこよくない部分もそのまま。",
                color: "text-emerald-700 bg-emerald-50 border-emerald-200",
              },
              {
                label: "一人会社の作り方",
                text: "AIを使った業務設計・意思決定・ツールスタックの記録。再現性を意識して書きます。",
                color: "text-amber-700 bg-amber-50 border-amber-200",
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 items-start">
                <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 mt-0.5 ${item.color}`}>
                  {item.label}
                </span>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            ブログ記事のあいだの気づきや進捗は、Xにリアルタイムで投稿しています。
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://x.com/bensolopreneur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-lg hover:border-zinc-400 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.906-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @bensolopreneur
            </a>
            <a
              href="/blog"
              className="inline-flex items-center text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-lg hover:border-zinc-400 transition-colors"
            >
              記事を読む →
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
