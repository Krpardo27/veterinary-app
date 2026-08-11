"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { anchor: "servicios", label: "Servicios" },
  { anchor: "equipo", label: "Equipo" },
  { anchor: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="hidden items-center gap-7 text-sm font-medium text-[#4d5e58] md:flex">
      {links.map(({ anchor, label }) => {
        const href = isHome ? `#${anchor}` : `/#${anchor}`;
        return (
          <Link
            key={anchor}
            href={href}
            className="transition hover:text-[#2a6a5d]"
          >
            {label}
          </Link>
        );
      })}
      <Link
        href="/reservar"
        className="rounded-full bg-[#e08b4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c9742f]"
      >
        Agenda hoy
      </Link>
    </nav>
  );
}
