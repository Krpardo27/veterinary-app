import clsx from "clsx";
import React from "react";

type Props = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

export default function Heading({ children, level = 1, className }: Props) {
  const Tag: React.ElementType = `h${level}`;

  const sizeMap: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
    1: "text-2xl md:text-3xl",
    2: "text-xl md:text-2xl",
    3: "text-lg md:text-xl",
    4: "text-base",
    5: "text-sm",
    6: "text-xs",
  };

  return (
    <Tag
      className={clsx(
        "font-semibold tracking-tight text-zinc-900",
        sizeMap[level],
        className
      )}
    >
      {children}
    </Tag>
  );
}