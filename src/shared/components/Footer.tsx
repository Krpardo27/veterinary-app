import Link from "next/link";
import Image from "next/image";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiClock,
  FiInstagram,
  FiFacebook,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import { COLORS } from "@/shared/constants/theme";

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="relative scroll-mt-24 overflow-hidden border-t text-[#5c6f68]"
      style={{ borderColor: COLORS.border, backgroundColor: "#eef5f0" }}
    >
      <Image
        src="/shop/animal-print-2.png"
        alt=""
        width={180}
        height={160}
        aria-hidden
        className="pointer-events-none absolute -left-8 bottom-0 z-0 hidden select-none opacity-70 lg:block"
      />
      <Image
        src="/shop/animal-print-2.png"
        alt=""
        width={180}
        height={160}
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-0 hidden -rotate-180 select-none opacity-70 lg:block"
      />
      <Image
        src="/shop/animal-print-1.png"
        alt=""
        width={100}
        height={100}
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-6 z-0 hidden rotate-20 select-none opacity-60 lg:block"
      />
      <Image
        src="/shop/animal-print-1.png"
        alt=""
        width={80}
        height={80}
        aria-hidden
        className="pointer-events-none absolute right-1/3 bottom-8 z-0 hidden rotate-[-8deg] select-none opacity-60 lg:block"
      />
      <Image
        src="/shop/animal-print-1.png"
        alt=""
        width={64}
        height={64}
        aria-hidden
        className="pointer-events-none absolute left-2/3 top-1/2 z-0 hidden rotate-35 select-none opacity-50 lg:block"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="space-y-3">
            <p className="text-lg font-bold" style={{ color: COLORS.dark }}>
              Veterinaria El Abrazo
            </p>
            <p className="text-sm leading-relaxed">
              Cuidado veterinario integral, cercano y profesional para cada
              etapa de la vida de tu mascota.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCE8E2] bg-white text-[#1D3A35] transition-colors hover:border-[#0F766E]/40 hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
              >
                <FiInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCE8E2] bg-white text-[#1D3A35] transition-colors hover:border-[#0F766E]/40 hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
              >
                <FiFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.dark }}>
              Servicios
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/servicios/consulta-general" className="transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
                  Consultas generales
                </Link>
              </li>
              <li>
                <Link href="/servicios/vacunacion" className="transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
                  Vacunación
                </Link>
              </li>
              <li>
                <Link href="/servicios/cirugia" className="transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
                  Cirugías
                </Link>
              </li>
              <li>
                <Link href="/servicios/peluqueria" className="transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
                  Peluquería y estética
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="inline-flex items-center gap-1 font-medium transition-colors hover:text-[#0D6B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30" style={{ color: COLORS.primary }}>
                  Ver todos
                  <FiArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.dark }}>
              Horario de atención
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <FiClock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
                <div>
                  <p className="font-medium" style={{ color: COLORS.dark }}>Lun – Vie</p>
                  <p>09:00 – 20:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <FiClock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
                <div>
                  <p className="font-medium" style={{ color: COLORS.dark }}>Sábado</p>
                  <p>09:30 – 16:30</p>
                </div>
              </li>
            </ul>

            <div
              className="mt-4 flex items-start gap-2 rounded-lg border bg-white px-3 py-2.5"
              style={{ borderColor: `${COLORS.primary}33` }}
            >
              <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
              <p className="text-xs leading-relaxed">
                <span className="font-semibold" style={{ color: COLORS.dark }}>Urgencias 24h:</span>{" "}
                línea siempre disponible
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.dark }}>
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
                <span>Av. Central 123, Santiago</span>
              </li>
              <li className="flex items-start gap-2">
                <FiPhone className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
                <a href="tel:+56221457892" className="transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
                  +562 21457892
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMail className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
                <a href="mailto:contacto@elabrazo.cl" className="break-all transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
                  contacto@elabrazo.cl
                </a>
              </li>
            </ul>

            <Link
              href="/reservar"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl px-4 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto sm:px-6"
              style={{ backgroundColor: COLORS.primary }}
            >
              Reservar cita
            </Link>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center gap-3 border-t pt-6 text-xs sm:flex-row sm:justify-between"
          style={{ borderColor: COLORS.border }}
        >
          <p>© {new Date().getFullYear()} Veterinaria El Abrazo. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="text-zinc-400 transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-zinc-400 transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
