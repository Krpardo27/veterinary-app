import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col bg-[#F7FAF9]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#B9D9CF] bg-white text-[#0F766E] shadow-sm">
          <FiHome className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0F766E]">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1D3A35] sm:text-5xl">
          No encontramos esta página
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5C6F68] sm:text-base">
          El enlace puede estar incompleto, haber cambiado o corresponder a un servicio que ya no está disponible.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/reservar"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2A6A5D] px-5 text-sm font-bold text-white transition-colors hover:bg-[#23584D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A6A5D]/30 focus-visible:ring-offset-2"
          >
            <FiCalendar className="h-4 w-4" aria-hidden="true" />
            Reservar cita
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DCE8E2] bg-white px-5 text-sm font-bold text-[#1D3A35] transition-colors hover:border-[#2A6A5D]/40 hover:text-[#2A6A5D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A6A5D]/30 focus-visible:ring-offset-2"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}