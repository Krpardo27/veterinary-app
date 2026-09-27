import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaStethoscope } from "react-icons/fa";

export default function Banner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#DCE8E2] bg-[#102F2A]">
      <div className="absolute inset-0">
        <Image
          src="/shop/banner.png"
          alt="Atención veterinaria en Veterinaria El Abrazo"
          fill
          className="object-cover object-right opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#102F2A]/95 via-[#102F2A]/82 to-[#102F2A]/25" />
      </div>

      <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
        <p className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#BFE4D5] backdrop-blur-sm">
          Agenda y acompaña su cuidado
        </p>

        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          Atención veterinaria y peluquería con el mismo equipo de confianza.
        </h2>

        <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
          Revisa los servicios disponibles, elige un profesional si lo prefieres y agenda una hora según disponibilidad real.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/reservar"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#1D554A] transition hover:bg-[#EAF4F1]"
          >
            <FaCalendarAlt className="h-4 w-4" />
            Pedir hora
          </Link>
          <Link
            href="/servicios"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <FaStethoscope className="h-4 w-4" />
            Ver servicios
          </Link>
        </div>
      </div>
    </section>
  );
}

