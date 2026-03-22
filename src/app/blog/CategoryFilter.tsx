"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { key: "", label: "すべて" },
  { key: "engineering", label: "エンジニアリング" },
  { key: "business", label: "経営" },
  { key: "finance", label: "財務" },
  { key: "marketing", label: "マーケ" },
];

const activeColor: Record<string, string> = {
  "": "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900",
  engineering: "bg-blue-600 text-white",
  business: "bg-emerald-600 text-white",
  finance: "bg-amber-500 text-white",
  marketing: "bg-purple-600 text-white",
};

export default function CategoryFilter({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key) {
      params.set("category", key);
    } else {
      params.delete("category");
    }
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {categories.map((c) => {
        const isActive = current === c.key;
        return (
          <button
            key={c.key}
            onClick={() => handleClick(c.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              isActive
                ? activeColor[c.key]
                : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
