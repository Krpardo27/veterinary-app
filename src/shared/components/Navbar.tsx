"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNavbar, { type NavLinkItem } from "./MobileNavbar";

const links = [
  { anchor: "servicios", label: "Servicios" },
  { anchor: "equipo", label: "Equipo" },
  { anchor: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navLinks: NavLinkItem[] = links.map(({ anchor, label }) => ({
    anchor,
    label,
    href: isHome ? `#${anchor}` : `/#${anchor}`,
  }));

  return (
    <>
      <nav className="hidden items-center gap-7 text-sm font-medium text-[#4d5e58] md:flex">
        {navLinks.map(({ anchor, href, label }) => (
          <Link
            key={anchor}
            href={href}
            className="transition hover:text-[#2a6a5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a6a5d]/30"
          >
            {label}
          </Link>
        ))}
        <Link
          href="/reservar"
          className="rounded-full bg-[#e08b4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c9742f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e08b4f]/40"
        >
          Agenda hoy
        </Link>
      </nav>

      <MobileNavbar links={navLinks} />
    </>
  );
}
