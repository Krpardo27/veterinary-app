import Link from "next/link";
import { FaPaw } from "react-icons/fa";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#equipo", label: "Equipo" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dce8e2] bg-[#f5f7f2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-[#1d3a35]">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a6a5d] text-white shadow-lg shadow-[#2a6a5d]/20">
            <FaPaw className="text-lg" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight">Luma Vet</p>
            <p className="text-sm text-[#5c6f68]">Cuidado atento para cada mascota</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#4d5e58] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#2a6a5d]">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#contacto"
          className="rounded-full bg-[#e08b4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c9742f]"
        >
          Agenda hoy
        </Link>
      </div>
    </header>
  );
}
