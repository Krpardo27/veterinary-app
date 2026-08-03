import Link from "next/link";
import { FaPaw } from "react-icons/fa";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#equipo", label: "Equipo" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  return (
    <nav className="hidden items-center gap-7 text-sm font-medium text-[#4d5e58] md:flex">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition hover:text-[#2a6a5d]"
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="#contacto"
        className="rounded-full bg-[#e08b4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c9742f]"
      >
        Agenda hoy
      </Link>
    </nav>
  );
}
