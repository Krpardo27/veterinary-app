import Link from "next/link";
import Navbar from "./Navbar";
import { FaPaw } from "react-icons/fa";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dce8e2] bg-[#f5f7f2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-[#1d3a35]">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a6a5d] text-white shadow-lg shadow-[#2a6a5d]/20">
            <FaPaw className="text-lg" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight">Luma Vet</p>
            <p className="text-sm text-[#5c6f68]">
              Cuidado atento para cada mascota
            </p>
          </div>
        </Link>
        <Navbar />
      </div>
    </header>
  );
}
