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
} from "react-icons/fi";
import { COLORS } from "@/shared/constants/theme";

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="relative overflow-hidden border-t text-[#5c6f68]"
      style={{ borderColor: COLORS.border, backgroundColor: "#eef5f0" }}
    >
      <Image
        src="/shop/animal-print-2.png"
        alt=""
        width={180}
        height={160}
        aria-hidden
        className="pointer-events-none absolute -left-8 bottom-0 hidden select-none lg:block"
      />
      <Image
        src="/shop/animal-print-2.png"
        alt=""
        width={180}
        height={160}
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden -rotate-180 select-none lg:block"
      />
      <Image
        src="/shop/animal-print-1.png"
        alt=""
        width={100}
        height={100}
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-6 hidden rotate-[20deg] select-none lg:block"
      />
      <Image
        src="/shop/animal-print-1.png"
        alt=""
        width={80}
        height={80}
        aria-hidden
        className="pointer-events-none absolute right-1/3 bottom-8 hidden rotate-[-8deg] select-none lg:block"
      />
      <Image
        src="/shop/animal-print-1.png"
        alt=""
        width={64}
        height={64}
        aria-hidden
        className="pointer-events-none absolute left-2/3 top-1/2 hidden rotate-[35deg] select-none lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="space-y-3">
            <p className="text-lg font-bold" style={{ color: COLORS.dark }}>
              Luma Vet
            </p>
            <p className="text-sm leading-relaxed">
              Cuidado veterinario integral, cercano y profesional para cada
              etapa de la vida de tu mascota.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://instagram.com"
                aria-label="Síguenos en Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCE8E2] bg-white text-[#1D3A35] transition-colors hover:border-[#0F766E]/40 hover:text-[#0F766E]"
              >
                <FiInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Síguenos en Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCE8E2] bg-white text-[#1D3A35] transition-colors hover:border-[#0F766E]/40 hover:text-[#0F766E]"
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
                <Link href="/servicios/consulta-general" className="transition-colors hover:text-[#0F766E]">
                  Consultas generales
                </Link>
              </li>
              <li>
                <Link href="/servicios/vacuna-octuple" className="transition-colors hover:text-[#0F766E]">
                  Vacunación
                </Link>
              </li>
              <li>
                <Link href="/servicios/esterilizacion" className="transition-colors hover:text-[#0F766E]">
                  Cirugías
                </Link>
              </li>
              <li>
                <Link href="/servicios/bano-completo" className="transition-colors hover:text-[#0F766E]">
                  Peluquería y estética
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="font-medium transition-colors hover:text-[#0D6B63]" style={{ color: COLORS.primary }}>
                  Ver todos →
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
                <a href="tel:+56221457892" className="transition-colors hover:text-[#0F766E]">
                  +562 21457892
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMail className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
                <a href="mailto:contacto@lumavet.com" className="break-all transition-colors hover:text-[#0F766E]">
                  contacto@lumavet.com
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
          <p>© {new Date().getFullYear()} Luma Vet. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="text-zinc-400">Privacidad · Términos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
