import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiClock, FiDollarSign, FiEdit3, FiTag } from "react-icons/fi";
import CreateServiceButton from "@/features/servicios/components/CreateServiceButton";

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      where: {},
      include: { category: true, _count: { select: { reservations: true } } },
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Servicios</h2>
          <p className="mt-2 text-zinc-400">
            Edita y publica el catálogo de servicios
          </p>
        </div>

        <CreateServiceButton categories={categories} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="group rounded-2xl border cursor-pointer border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-[#0F766E]/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {service.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {service.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  service.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {service.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="space-y-2 border-t border-zinc-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FiDollarSign className="h-4 w-4" />
                  Precio
                </span>
                <span className="text-zinc-900 font-semibold">
                  ${service.price.toLocaleString("es-CL")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FiClock className="h-4 w-4" />
                  Duración
                </span>
                <span className="text-zinc-900">{service.durationMin} min</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FiTag className="h-4 w-4" />
                  Categoría
                </span>
                <span className="text-zinc-900">{service.category.name}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <span className="text-sm text-zinc-400">Reservas</span>
                <span className="inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-semibold text-xs px-1.5">
                  {service._count.reservations}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-4">
              <Link
                href={`/admin/servicios/${service.id}/edit`}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#0F766E]/30 px-4 text-xs font-bold uppercase tracking-wide text-[#0F766E] transition-colors hover:border-[#0F766E] hover:bg-[#0F766E]/5 sm:w-auto"
              >
                <FiEdit3 className="h-4 w-4" />
                Editar servicio
              </Link>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
          <p className="text-zinc-400">No hay servicios registrados.</p>
        </div>
      )}
    </div>
  );
}
