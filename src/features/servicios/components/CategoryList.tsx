"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/generated/prisma/client";

type CategoryListProps = {
  categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  const pathname = usePathname();
  const isAllActive = pathname === "/servicios";

  const baseStyles =
    "inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#0F766E] px-4 text-sm font-semibold transition-all duration-150 active:scale-95";

  const activeStyles =
    "border-[#0F766E] bg-[#0F766E] text-white shadow-sm shadow-[#0F766E]/20";

  const inactiveStyles =
    "border-[#0F766E] bg-white text-[#475569] hover:border-[#0F766E]/40 hover:bg-[#EAF4F1] hover:text-[#0F766E]";

  return (
    <div className="relative">
      <nav
        className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1 pr-14 [-ms-overflow-style:none] sm:pr-0 [&::-webkit-scrollbar]:hidden"
        aria-label="Categorías de servicios"
      >
        <Link
          href="/servicios"
          aria-current={isAllActive ? "page" : undefined}
          className={`snap-start ${baseStyles} ${isAllActive ? activeStyles : inactiveStyles}`}
        >
          Todos
        </Link>

        {categories.map((category) => {
          const isActive = pathname === `/servicios/${category.slug}`;

          return (
            <Link
              key={category.id}
              href={`/servicios/${category.slug}`}
              aria-current={isActive ? "page" : undefined}
              className={`snap-start ${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
            >
              {category.name}
            </Link>
          );
        })}
      </nav>

      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-[#F7FAF9] to-transparent sm:hidden" />
    </div>
  );
}
