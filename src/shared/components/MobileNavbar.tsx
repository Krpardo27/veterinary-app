"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiFacebook, FiInstagram, FiMenu, FiX } from "react-icons/fi";

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

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const menu = isOpen && typeof document !== "undefined"
    ? createPortal(
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-[#102D29]/45 backdrop-blur-[2px]"
          />

          <div className="fixed inset-x-4 top-20 z-60 rounded-2xl border border-[#dce8e2] bg-white p-2 shadow-xl shadow-[#1d3a35]/20 md:hidden">
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

            <div className="mt-2 flex items-center justify-between border-t border-[#dce8e2] px-4 pt-3 text-sm text-[#5c6f68]">
              <span>Síguenos</span>
              <div className="flex items-center gap-2">
                <Link
                  href="https://instagram.com"
                  aria-label="Síguenos en Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf4f1] text-[#2a6a5d] transition hover:bg-[#dce8e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a6a5d]/30"
                >
                  <FiInstagram className="h-4 w-4" />
                </Link>
                <Link
                  href="https://facebook.com"
                  aria-label="Síguenos en Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf4f1] text-[#2a6a5d] transition hover:bg-[#dce8e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a6a5d]/30"
                >
                  <FiFacebook className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        className="relative z-70 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#dce8e2] bg-white text-[#1d3a35] shadow-sm transition-colors hover:border-[#2a6a5d]/40 hover:text-[#2a6a5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a6a5d]/30"
      >
        {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </button>

      {menu}
    </div>
  );
}