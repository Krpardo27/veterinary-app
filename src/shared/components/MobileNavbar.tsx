"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export type NavLinkItem = {
  anchor: string;
  label: string;
  href: string;
};

type MobileNavbarProps = {
  links: NavLinkItem[];
};

export default function MobileNavbar({ links }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#dce8e2] bg-white text-[#1d3a35] shadow-sm transition-colors hover:border-[#2a6a5d]/40 hover:text-[#2a6a5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a6a5d]/30"
      >
        {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-20 z-50 rounded-2xl border border-[#dce8e2] bg-white p-2 shadow-xl shadow-[#1d3a35]/10">
          <nav className="grid gap-1 text-sm font-semibold text-[#1d3a35]">
            {links.map(({ anchor, href, label }) => (
              <Link
                key={anchor}
                href={href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 transition-colors hover:bg-[#eaf4f1] hover:text-[#2a6a5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a6a5d]/30"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/reservar"
              onClick={() => setIsOpen(false)}
              className="mt-1 rounded-xl bg-[#e08b4f] px-4 py-3 text-center font-bold text-white transition hover:bg-[#c9742f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e08b4f]/40"
            >
              Agenda hoy
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}