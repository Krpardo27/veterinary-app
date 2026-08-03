import { type SelectHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  children?: ReactNode;
};

export default function FormSelectCategory({ className, children, ...props }: Props) {
  return (
    <select
      {...props}
      className={clsx(
        "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20",
        className,
      )}
    >
      {children}
    </select>
  );
}
