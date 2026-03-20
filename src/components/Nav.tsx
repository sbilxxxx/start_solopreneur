type NavProps = {
  current?: "about" | "blog" | "dashboard";
};

export default function Nav({ current }: NavProps) {
  return (
    <nav className="border-b border-zinc-100 dark:border-zinc-800">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:opacity-70 transition-opacity">
          Start Solopreneur
        </a>
        <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <a
            href="/about"
            className={current === "about"
              ? "text-zinc-900 dark:text-zinc-100 font-medium"
              : "hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"}
          >
            About
          </a>
          <a
            href="/blog"
            className={current === "blog"
              ? "text-zinc-900 dark:text-zinc-100 font-medium"
              : "hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"}
          >
            Blog
          </a>
          <a
            href="/dashboard"
            className={current === "dashboard"
              ? "text-zinc-900 dark:text-zinc-100 font-medium"
              : "hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"}
          >
            Dashboard
          </a>
        </div>
      </div>
    </nav>
  );
}
