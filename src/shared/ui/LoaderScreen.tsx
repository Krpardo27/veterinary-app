"use client";

import { createPortal } from "react-dom";
import { LuLoaderCircle, LuPawPrint } from "react-icons/lu";

interface LoaderScreenProps {
  title: string;
  description?: string;
  badgeText?: string;
  mode?: "page" | "overlay";
}

export default function LoaderScreen({
  title,
  description,
  badgeText,
  mode = "page",
}: LoaderScreenProps) {
  const rootClassName =
    mode === "overlay"
      ? "fixed inset-0 z-[9999] grid place-items-center bg-[var(--background)] px-4 text-center"
      : "grid min-h-screen place-items-center bg-[var(--background)] px-4 text-center";

  const screen = (
    <main
      className={rootClassName}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-xl shadow-slate-900/5">
        {badgeText && (
          <span className="mb-5 inline-flex items-center rounded-full border border-[var(--primary)]/25 bg-[var(--secondary)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            {badgeText}
          </span>
        )}

        <div className="relative mx-auto mb-5 grid size-16 place-items-center">
          {/* Anillo de "respiración" detrás del ícono, para transmitir calma */}
          <span className="absolute inset-0 rounded-2xl bg-[var(--secondary)] motion-safe:animate-ping [animation-duration:2.4s]" />
          <div className="relative grid size-16 place-items-center rounded-2xl border border-[var(--primary)]/25 bg-[var(--secondary)] text-[var(--primary)] shadow-sm">
            <div className="relative grid size-10 place-items-center">
              <LuLoaderCircle className="absolute inset-0 size-10 animate-spin text-[var(--primary)]" />
              <LuPawPrint className="size-5 text-[var(--primary)]" />
            </div>
          </div>
        </div>

        <h1 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        )}

        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent motion-safe:animate-pulse" />
        </div>
      </div>
    </main>
  );

  if (mode === "overlay") {
    return typeof document === "undefined"
      ? null
      : createPortal(screen, document.body);
  }

  return screen;
}