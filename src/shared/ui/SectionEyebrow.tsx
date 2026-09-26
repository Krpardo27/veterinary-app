import clsx from "clsx";
import type { ReactNode } from "react";
import { COLORS } from "@/shared/constants/theme";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
  tone?: "default" | "light";
};

export default function SectionEyebrow({
  children,
  className,
  tone = "default",
}: SectionEyebrowProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold",
        tone === "light" && "bg-white/10 text-white",
        className,
      )}
      style={
        tone === "default"
          ? { backgroundColor: COLORS.primary_bg, color: COLORS.primary }
          : undefined
      }
    >
      {children}
    </span>
  );
}