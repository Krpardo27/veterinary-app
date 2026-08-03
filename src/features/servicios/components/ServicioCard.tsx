import type { Service } from "@/generated/prisma/client";
import { FiClock, FiStar } from "react-icons/fi";
import Link from "next/link";

type ServiceCardProps = {
  service: Service;
};

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

export default function ServicioCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0F766E]/30 hover:shadow-md sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          {service.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#0F766E]/20 bg-[#0F766E]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0F766E]">
              <FiStar className="h-3 w-3" />
              Destacado
            </span>
          )}

          <div className="ml-auto flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs text-[#64748B]">
            <FiClock className="h-3 w-3 text-[#0F766E]" />
            <span>{formatDuration(service.durationMin)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#0F766E]">
            {service.name}
          </h3>

          {service.description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-[#64748B]">
              {service.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[#E2E8F0] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Precio
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-[#0F766E]">
              ${service.price.toLocaleString("es-CL")}
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">CLP</span>
          </div>
        </div>

        <Link
          href={`/reservar?servicio=${service.slug}`}
          aria-label={`Reservar cita para ${service.name}`}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 active:scale-[0.98] sm:w-auto"
        >
          Reservar cita
        </Link>
      </div>
    </article>
  );
}