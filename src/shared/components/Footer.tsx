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

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="relative overflow-hidden border-t border-[#dce8e2] bg-[#eef5f0] text-[#5c6f68]"
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
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-[#17322c]">Luma Vet</p>
            </div>
            <p className="text-sm leading-relaxed">
              Cuidado veterinario integral, cercano y profesional para cada
              etapa de la vida de tu mascota.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://instagram.com"
                aria-label="Síguenos en Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dce8e2] bg-white text-[#17322c] transition-colors hover:border-[#0F766E]/40 hover:text-[#0F766E]"
              >
                <FiInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Síguenos en Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dce8e2] bg-white text-[#17322c] transition-colors hover:border-[#0F766E]/40 hover:text-[#0F766E]"
              >
                <FiFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17322c]">
              Servicios
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/servicios/consultas"
                  className="transition-colors hover:text-[#0F766E]"
                >
                  Consultas generales
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/vacunacion"
                  className="transition-colors hover:text-[#0F766E]"
                >
                  Vacunación
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/cirugia"
                  className="transition-colors hover:text-[#0F766E]"
                >
                  Cirugías
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/estetica"
                  className="transition-colors hover:text-[#0F766E]"
                >
                  Peluquería y estética
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="font-medium text-[#0F766E] transition-colors hover:text-[#0D6B63]"
                >
                  Ver todos →
                </Link>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17322c]">
              Horario de atención
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <FiClock className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                <div>
                  <p className="font-medium text-[#17322c]">Lun – Vie</p>
                  <p>09:00 – 20:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <FiClock className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                <div>
                  <p className="font-medium text-[#17322c]">Sábado</p>
                  <p>09:00 – 14:00</p>
                </div>
              </li>
            </ul>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#0F766E]/20 bg-white px-3 py-2.5">
              <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
              <p className="text-xs leading-relaxed">
                <span className="font-semibold text-[#17322c]">
                  Urgencias 24h:
                </span>{" "}
                línea siempre disponible
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17322c]">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                <span>Av. Central 123, Santiago</span>
              </li>
              <li className="flex items-start gap-2">
                <FiPhone className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                <a
                  href="tel:+56221457892"
                  className="transition-colors hover:text-[#0F766E]"
                >
                  +562 21457892
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMail className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                <a
                  href="mailto:contacto@lumavet.com"
                  className="break-all transition-colors hover:text-[#0F766E]"
                >
                  contacto@lumavet.com
                </a>
              </li>
            </ul>

            <Link
              href="/reservar"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#0F766E] px-4 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 sm:w-auto sm:px-6"
            >
              Reservar cita
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-[#dce8e2] pt-6 text-xs sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Luma Vet. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacidad"
              className="transition-colors hover:text-[#0F766E]"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="transition-colors hover:text-[#0F766E]"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
