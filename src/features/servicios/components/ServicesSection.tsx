import ServicioCard from "./ServicioCard";
import type { Service } from "@/generated/prisma/client";

type ServicesSectionProps = {
  services: Service[];
  emptyMessage?: string;
};

export default function ServiciosSection({
  services,
  emptyMessage = "No hay servicios disponibles.",
}: ServicesSectionProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#E2E8E5] bg-white py-16 text-center">
        <span className="text-3xl">🐾</span>
        <p className="text-sm font-medium text-[#64748B]">{emptyMessage}</p>
        <p className="text-xs text-[#94A3B8]">
          Vuelve a intentarlo más tarde o contáctanos directamente.
        </p>
      </div>
    );
  }

  const featured = services.filter((s) => s.featured);
  const rest = services.filter((s) => !s.featured);

  return (
    <div className="space-y-8">
      {featured.length > 0 && (
        <section aria-labelledby="destacados-heading">
          <h2
            id="destacados-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F766E]"
          >
            Más solicitados
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {featured.map((service) => (
              <ServicioCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="todos-heading">
          {featured.length > 0 && (
            <h2
              id="todos-heading"
              className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#64748B]"
            >
              Todos los servicios
            </h2>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {rest.map((service) => (
              <ServicioCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}