"use client";

import { createPortal } from "react-dom";
import { LuLoaderCircle, LuPawPrint } from "react-icons/lu";
import { COLORS } from "@/shared/constants/theme";

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
      ? "fixed inset-0 z-[9999] grid place-items-center px-4 text-center"
      : "grid min-h-screen place-items-center px-4 text-center";

  const screen = (
    <main
      className={rootClassName}
      style={{ backgroundColor: COLORS.bg_light }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6 text-center shadow-xl"
        style={{
          borderColor: COLORS.border,
          backgroundColor: COLORS.bg_white,
          boxShadow: `0 20px 40px -12px ${COLORS.primary}18`,
        }}
      >
        {badgeText && (
          <span
            className="mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]"
            style={{
              borderColor: `${COLORS.primary}40`,
              backgroundColor: COLORS.primary_bg,
              color: COLORS.primary,
            }}
          >
            {badgeText}
          </span>
        )}

        <div className="relative mx-auto mb-5 grid size-16 place-items-center">
          {/* Anillo de "respiración" detrás del ícono */}
          <span
            className="absolute inset-0 rounded-2xl motion-safe:animate-ping [animation-duration:2.4s]"
            style={{ backgroundColor: COLORS.primary_bg }}
          />
          <div
            className="relative grid size-16 place-items-center rounded-2xl border shadow-sm"
            style={{
              borderColor: `${COLORS.primary}40`,
              backgroundColor: COLORS.primary_bg,
              color: COLORS.primary,
            }}
          >
            <div className="relative grid size-10 place-items-center">
              <LuLoaderCircle
                className="absolute inset-0 size-10 animate-spin"
                style={{ color: COLORS.primary }}
              />
              <LuPawPrint className="size-5" style={{ color: COLORS.primary }} />
            </div>
          </div>
        </div>

        <h1
          className="text-base font-semibold tracking-tight"
          style={{ color: COLORS.darker }}
        >
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLORS.text_muted }}>
            {description}
          </p>
        )}

        <div
          className="mt-6 h-1 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: COLORS.primary_bg }}
        >
          <div
            className="h-full w-1/3 rounded-full motion-safe:animate-pulse"
            style={{
              background: `linear-gradient(to right, transparent, ${COLORS.primary}, transparent)`,
            }}
          />
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
