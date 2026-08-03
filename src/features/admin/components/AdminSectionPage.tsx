import type { ReactNode } from "react";

type AdminSectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  children?: ReactNode;
};

export default function AdminSectionPage({
  eyebrow,
  title,
  description,
  badge,
  children,
}: AdminSectionPageProps) {
  return (
    <div className="space-y-6 rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_70px_-25px_rgba(0,0,0,0.18)] transition-colors duration-300 ">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{title}</h2>
          {badge ? (
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {badge}
            </span>
          ) : null}
        </div>

        <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">{description}</p>
      </div>

      {children}
    </div>
  );
}
