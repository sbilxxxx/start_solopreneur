import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type KpiData = {
  x: { followers: number | null; following: number | null; tweets: number | null; error?: boolean };
  articles: { count: number | null; error?: boolean };
  updatedAt: string;
};

async function getKpi(): Promise<KpiData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/kpi`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function KpiCard({
  label,
  value,
  sub,
  note,
  href,
  color = "zinc",
}: {
  label: string;
  value: string | number | null;
  sub?: string;
  note?: string;
  href?: string;
  color?: "blue" | "emerald" | "amber" | "purple" | "zinc";
}) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-100 dark:bg-blue-950 dark:border-blue-900",
    emerald: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950 dark:border-emerald-900",
    amber: "bg-amber-50 border-amber-100 dark:bg-amber-950 dark:border-amber-900",
    purple: "bg-purple-50 border-purple-100 dark:bg-purple-950 dark:border-purple-900",
    zinc: "bg-zinc-50 border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800",
  };

  const display = value === null ? "—" : value.toLocaleString();

  return (
    <div className={`border rounded-xl p-5 ${colorMap[color]}`}>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">{label}</p>
      <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{display}</p>
      {sub && <p className="text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>}
      {note && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">{note}</p>}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          詳細を見る →
        </a>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const kpi = await getKpi();

  const updatedAt = kpi?.updatedAt
    ? new Date(kpi.updatedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Nav current="dashboard" />

      <main className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-3">Internal</p>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">KPI ダッシュボード</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            プロジェクトの主要指標を一覧で確認する内部ページです。
          </p>
          {updatedAt && (
            <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-2">最終更新: {updatedAt}</p>
          )}
        </div>

        {/* X / SNS */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">X（Twitter）</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KpiCard
              label="フォロワー"
              value={kpi?.x.followers ?? null}
              sub="目標: 1ヶ月100人"
              color="blue"
            />
            <KpiCard
              label="ポスト数"
              value={kpi?.x.tweets ?? null}
              color="zinc"
            />
            <KpiCard
              label="フォロー中"
              value={kpi?.x.following ?? null}
              color="zinc"
            />
          </div>
        </section>

        {/* コンテンツ */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">コンテンツ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KpiCard
              label="公開記事数"
              value={kpi?.articles.count ?? null}
              sub="content/blog/"
              color="emerald"
            />
            <KpiCard
              label="Zennクロスポスト"
              value={0}
              sub="目標: 月2本"
              color="zinc"
            />
          </div>
        </section>

        {/* PV（GA4） */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">アクセス（GA4）</h2>
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
              GA4のデータはGoogle Analytics管理画面で確認できます。
              API連携はPhase 4で実装予定です。
            </p>
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Google Analytics を開く →
            </a>
          </div>
        </section>

        {/* コスト */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">コスト（月次）</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KpiCard
              label="インフラ"
              value="¥0"
              sub="Vercel 無料枠"
              color="amber"
            />
            <KpiCard
              label="X API"
              value="$5"
              sub="開発クレジット（初回のみ）"
              color="zinc"
            />
            <KpiCard
              label="Claude Code"
              value="従量制"
              sub="finance/ で管理"
              color="zinc"
            />
          </div>
        </section>

        {/* フェーズ進捗 */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">フェーズ進捗</h2>
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl divide-y divide-zinc-100 dark:divide-zinc-800">
            {[
              { phase: "Phase 1", label: "基礎構築", done: true },
              { phase: "Phase 2", label: "会社組織化 + コンテンツ基盤 + X連携", done: true },
              { phase: "Phase 3", label: "マーケ運用 + SEO計測基盤 + Subagents", done: false, current: true },
              { phase: "Phase 4", label: "AI機能実装（Agent Teams・チャット・RAG）", done: false },
              { phase: "Phase 5", label: "高度自動化（Plugins・スケジュール実行）", done: false },
              { phase: "Phase 6", label: "収益化 + 資金管理", done: false },
            ].map((p) => (
              <div key={p.phase} className="flex items-center gap-4 px-5 py-3">
                <span className="text-lg">{p.done ? "✅" : p.current ? "🔄" : "⬜"}</span>
                <span className="text-xs font-mono text-zinc-400 w-16 shrink-0">{p.phase}</span>
                <span className={`text-sm ${p.current ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
