import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiClock, FiDollarSign, FiEdit3, FiStar, FiTag } from "react-icons/fi";
import AdminSectionPage from "@/features/admin/components/AdminSectionPage";
import CreateServiceButton from "@/features/servicios/components/CreateServiceButton";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        durationMin: true,
        featured: true,
        isActive: true,
        category: { select: { name: true } },
        _count: { select: { reservations: true } },
      },
      orderBy: [{ isActive: "desc" }, { featured: "desc" }, { createdAt: "desc" }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  const activeCount = services.filter((service) => service.isActive).length;
  const inactiveCount = services.length - activeCount;
  const featuredCount = services.filter((service) => service.featured).length;

  return (
    <AdminSectionPage
      eyebrow="Catálogo"
      title="Servicios"
      description="Edita precios, duración, categoría y visibilidad del catálogo."
      badge="Catálogo"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-2xl font-bold text-zinc-900">{services.length}</p>
              <p className="text-xs text-zinc-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F766E]">{activeCount}</p>
              <p className="text-xs text-zinc-500">Activos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-500">{inactiveCount}</p>
              <p className="text-xs text-zinc-500">Inactivos</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <FiStar className="size-3.5" />
              {featuredCount} destacados
            </span>
            <CreateServiceButton categories={categories} />
          </div>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-[#0F766E] shadow-sm">
              <FiTag className="size-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-700">No hay servicios registrados.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-[#0F766E]/40 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {service.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {service.description ?? "Sin descripción"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {service.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                        <FiStar className="size-3" />
                        Destacado
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
                        service.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      {service.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                      <FiDollarSign className="h-4 w-4" />
                      Precio
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {currencyFormatter.format(service.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                      <FiClock className="h-4 w-4" />
                      Duración
                    </span>
                    <span className="font-medium text-zinc-900">{service.durationMin} min</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                      <FiTag className="h-4 w-4" />
                      Categoría
                    </span>
                    <span className="truncate text-right font-medium text-zinc-900">{service.category.name}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-2">
                    <span className="text-sm text-zinc-500">Reservas asociadas</span>
                    <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${service._count.reservations > 0 ? "bg-[#0F766E]/10 text-[#0F766E]" : "bg-zinc-100 text-zinc-500"}`}>
                      {service._count.reservations}
                    </span>
                  </div>
                </div>

                <div className="mt-auto border-t border-zinc-100 pt-4">
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
        )}
      </div>
    </AdminSectionPage>
  );
}
