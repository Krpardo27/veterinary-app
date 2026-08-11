import Link from "next/link";
import { FaCalendarAlt, FaPaw } from "react-icons/fa";
import { COLORS } from "@/shared/constants/theme";

export default function CtaSection() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24"
      style={{ backgroundColor: COLORS.secondary }}
    >
      {/* Decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FaPaw
          className="absolute -right-8 -top-8 h-48 w-48 rotate-12 opacity-5"
          style={{ color: "white" }}
        />
        <FaPaw
          className="absolute -bottom-8 -left-8 h-40 w-40 -rotate-12 opacity-5"
          style={{ color: "white" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          🐾 Luma Vet
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Tu mascota se merece la mejor atención
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
          Agenda una cita hoy y cuida la salud de tu compañero con el respaldo de nuestro equipo de profesionales.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/reservar"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 text-sm font-bold transition-all hover:opacity-90 hover:shadow-lg"
            style={{ color: COLORS.secondary }}
          >
            <FaCalendarAlt className="h-4 w-4" />
            Reservar cita ahora
          </Link>
          <a
            href="#equipo"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white transition-all hover:bg-white/20"
          >
            Conoce nuestro equipo
          </a>
        </div>
      </div>
    </section>
  );
}
