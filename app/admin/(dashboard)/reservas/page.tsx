import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminSectionPage from "@/features/admin/components/AdminSectionPage";
import AdminSearch from "@/features/admin/components/AdminSearch";
import Pagination from "@/features/admin/components/Pagination";
import { ReservationStatus } from "@/generated/prisma/enums";
import ReservasTable from "@/features/dashboard/reservas/ReservasTable";
import ReservationFilters from "@/features/dashboard/reservas/ReservationFilters";

const ITEMS_PER_PAGE = 15;

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING:   "bg-amber-50  border-amber-200  text-amber-700",
  CONFIRMED: "bg-emerald-50 border-emerald-200 text-emerald-700",
  COMPLETED: "bg-zinc-100  border-zinc-200   text-zinc-600",
  CANCELLED: "bg-red-50    border-red-200    text-red-600",
  NO_SHOW:   "bg-orange-50 border-orange-200 text-orange-700",
};

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string; date?: string; serviceId?: string }>;
}) {
  const { page, q, status, date, serviceId } = await searchParams;
  const pageNumber = Number(page);
  const currentPage = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const query = q?.trim() || "";
  const dateFilter = date?.trim() || "";
  const serviceIdFilter = serviceId?.trim() || "";
  const statusFilter = Object.values(ReservationStatus).includes(status as ReservationStatus)
    ? (status as ReservationStatus)
    : undefined;

  const where = {
    ...(statusFilter && { status: statusFilter }),
    ...(serviceIdFilter && { serviceId: serviceIdFilter }),
    ...(dateFilter && {
      startAt: {
        gte: new Date(`${dateFilter}T00:00:00`),
        lte: new Date(`${dateFilter}T23:59:59`),
      },
    }),
    ...(query && {
      OR: [
        { serviceName: { contains: query, mode: "insensitive" as const } },
        { customer: { name: { contains: query, mode: "insensitive" as const } } },
        { veterinarian: { name: { contains: query, mode: "insensitive" as const } } },
      ],
    }),
  };

  const [totalItems, reservations, stats, services] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.reservation.findMany({
      where,
      orderBy: { startAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        serviceName: true,
        servicePrice: true,
        durationMin: true,
        startAt: true,
        status: true,
        customer: { select: { name: true, phone: true } },
        veterinarian: { select: { name: true } },
      },
    }),
    prisma.reservation.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalPages > 0 && currentPage > totalPages) {
    const params = new URLSearchParams({ page: String(totalPages) });
    if (query) params.set("q", query);
    if (statusFilter) params.set("status", statusFilter);
    if (dateFilter) params.set("date", dateFilter);
    if (serviceIdFilter) params.set("serviceId", serviceIdFilter);
    redirect(`/admin/reservas?${params.toString()}`);
  }

  const statMap = Object.fromEntries(
    stats.map((s) => [s.status, s._count._all]),
  ) as Partial<Record<ReservationStatus, number>>;

  return (
    <AdminSectionPage
      eyebrow="Gestión clínica"
      title="Reservas"
      description="Historial completo de reservas del centro veterinario."
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["CONFIRMED", "Confirmadas"],
              ["PENDING", "Pendientes"],
              ["COMPLETED", "Completadas"],
              ["CANCELLED", "Canceladas"],
            ] as [ReservationStatus, string][]
          ).map(([s, label]) => (
            <div key={s} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-2xl font-bold text-zinc-900">{statMap[s] ?? 0}</p>
              <p className="mt-1 text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Search + status pills */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <AdminSearch initialQuery={query} placeholder="Buscar por cliente, servicio o veterinario" />

          <div className="flex flex-wrap gap-2">
            {[undefined, ...Object.values(ReservationStatus)].map((s) => {
              const isActive = statusFilter === s;
              const label = s ? STATUS_LABELS[s] : "Todos";
              const href = s
                ? `/admin/reservas?status=${s}${query ? `&q=${query}` : ""}`
                : `/admin/reservas${query ? `?q=${query}` : ""}`;
              return (
                <a key={s ?? "all"} href={href}
                  className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-[#0F766E] bg-[#0F766E] text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-[#0F766E]/40 hover:text-[#0F766E]"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        <ReservationFilters
          date={dateFilter}
          serviceId={serviceIdFilter}
          services={services}
        />

        <ReservasTable reservations={reservations} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          itemLabel="reservas"
        />
      </div>
    </AdminSectionPage>
  );
}
