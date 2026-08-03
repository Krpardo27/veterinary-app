"use client";

import { useState } from "react";
import clsx from "clsx";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

export default function FormSearchSelect({
  options,
  value,
  onChange,
  placeholder = "Selecciona",
  disabled,
  error,
  className,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full rounded-xl px-4 py-3 text-sm transition",
          "bg-white text-black placeholder:text-black/40",
          "border border-black/20",
          "focus:outline-none focus:border-[#DB4444] focus:ring-2 focus:ring-[#DB4444]/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-200",
          disabled && "bg-black/5 text-black/40 cursor-not-allowed",
          className
        )}
      />

      {/* DROPDOWN */}
      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-black/10 rounded-xl shadow-md max-h-60 overflow-y-auto">
          
          {filtered.length === 0 && (
            <div className="p-3 text-sm text-black">
              Sin resultados
            </div>
          )}

          {filtered.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setQuery(option.label);
                setOpen(false);
              }}
              className="
                w-full text-left px-4 py-2 text-sm
                hover:bg-[#F5F5F5] text-black
                transition
              "
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}