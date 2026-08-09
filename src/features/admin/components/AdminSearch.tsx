"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface AdminSearchProps {
  initialQuery: string;
  placeholder: string;
  queryParam?: string;
  resetParams?: string[];
  debounceMs?: number;
  clearLabel?: string;
  ariaLabel?: string;
  className?: string;
}

export default function AdminSearch({
  initialQuery,
  placeholder,
  queryParam = "q",
  resetParams = ["page"],
  debounceMs = 300,
  clearLabel = "Limpiar",
  ariaLabel = "Buscar",
  className = "",
}: AdminSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  function buildUrl(nextQuery: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = nextQuery.trim();
    resetParams.forEach((param) => params.delete(param));
    if (trimmedQuery) {
      params.set(queryParam, trimmedQuery);
    } else {
      params.delete(queryParam);
    }
    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  }

  function replaceQuery(nextQuery: string) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    startTransition(() => {
      router.replace(buildUrl(nextQuery), { scroll: false });
    });
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      replaceQuery(nextQuery);
    }, debounceMs);
  }

  function handleClear() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    setQuery("");
    replaceQuery("");
  }

  const preservedParams = Array.from(searchParams.entries()).filter(
    ([key]) => key !== queryParam && !resetParams.includes(key),
  );

  return (
    <form
      method="get"
      action={pathname}
      className={`w-full ${className}`}
    >
      {preservedParams.map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">{ariaLabel}</span>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            ref={inputRef}
            type="search"
            name={queryParam}
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-busy={isPending}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
          >
            <FiX className="h-4 w-4" />
            {clearLabel}
          </button>
        </div>
      </div>
    </form>
  );
}