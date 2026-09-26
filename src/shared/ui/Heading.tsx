import clsx from "clsx";
import React from "react";

type Props = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function Heading({ children, level = 1, className, ...props }: Props) {
  const Tag: React.ElementType = `h${level}`;

  const sizeMap: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
    1: "text-4xl sm:text-5xl",
    2: "text-3xl sm:text-4xl",
    3: "text-2xl sm:text-3xl",
    4: "text-xl sm:text-2xl",
    5: "text-lg sm:text-xl",
    6: "text-base sm:text-lg",
  };

  return (
    <Tag
      {...props}
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