import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSectionPage from "@/features/admin/components/AdminSectionPage";
import AdminSearch from "@/features/admin/components/AdminSearch";
import Pagination from "@/features/admin/components/Pagination";
import { ReservationStatus } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { getDayRange } from "@/features/booking/services/availability";
import ReservasTable from "@/features/dashboard/reservas/components/ReservasTable";
import ReservationFilters from "@/features/dashboard/reservas/components/ReservationFilters";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "@/features/dashboard/reservas/components/reservationStatus";

const ITEMS_PER_PAGE = 15;

function isValidDateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

function buildReservationsUrl(params: {
  q?: string;
  status?: ReservationStatus;
  date?: string;
  serviceId?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.status) searchParams.set("status", params.status);
  if (params.date) searchParams.set("date", params.date);
  if (params.serviceId) searchParams.set("serviceId", params.serviceId);
  const search = searchParams.toString();
  return search ? `/admin/reservas?${search}` : "/admin/reservas";
}

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
  const rawDateFilter = date?.trim() || "";
  const dateFilter = rawDateFilter && isValidDateInput(rawDateFilter) ? rawDateFilter : "";
  const dateRange = dateFilter ? getDayRange(dateFilter) : null;
  const serviceIdFilter = serviceId?.trim() || "";
  const statusFilter = Object.values(ReservationStatus).includes(status as ReservationStatus)
    ? (status as ReservationStatus)
    : undefined;

  const where: Prisma.ReservationWhereInput = {
    ...(statusFilter && { status: statusFilter }),
    ...(serviceIdFilter && { serviceId: serviceIdFilter }),
    ...(dateRange && {
      startAt: {
        gte: dateRange.dayStart,
        lte: dateRange.dayEnd,
      },
    }),
    ...(query && {
      OR: [
        { serviceName: { contains: query, mode: "insensitive" as const } },
        { customer: { name: { contains: query, mode: "insensitive" as const } } },
        { professional: { name: { contains: query, mode: "insensitive" as const } } },
      ],
    }),
  };

  const [totalItems, reservations, stats, services] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.reservation.findMany({
      where,
      orderBy: dateRange ? { startAt: "asc" } : { createdAt: "desc" },
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
        professional: { select: { name: true } },
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
  const emptyMessage = query || statusFilter || dateFilter || serviceIdFilter
    ? "No hay reservas que coincidan con los filtros."
    : "No hay reservas registradas aún.";

  return (
    <AdminSectionPage
      eyebrow="Gestión clínica"
      title="Reservas"
      description="Historial completo de reservas del centro veterinario."
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Totales generales</h2>
              <p className="text-xs text-zinc-500">Estado global de reservas, independiente de los filtros aplicados.</p>
            </div>
            <span className="text-xs font-semibold text-[#0F766E]">
              {totalItems} {totalItems === 1 ? "resultado filtrado" : "resultados filtrados"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                "CONFIRMED",
                "PENDING",
                "COMPLETED",
                "CANCELLED",
              ] as ReservationStatus[]
            ).map((s) => (
              <div key={s} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${RESERVATION_STATUS_STYLES[s]}`}>
                  {RESERVATION_STATUS_LABELS[s]}
                </span>
              <p className="text-2xl font-bold text-zinc-900">{statMap[s] ?? 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search + status pills */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <AdminSearch initialQuery={query} placeholder="Buscar por cliente, servicio o profesional" />

          <div className="flex flex-wrap gap-2">
            {[undefined, ...Object.values(ReservationStatus)].map((s) => {
              const isActive = statusFilter === s;
              const label = s ? RESERVATION_STATUS_LABELS[s] : "Todos";
              const href = buildReservationsUrl({
                q: query,
                status: s,
                date: dateFilter,
                serviceId: serviceIdFilter,
              });
              return (
                <Link key={s ?? "all"} href={href} aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-[#0F766E] bg-[#0F766E] text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-[#0F766E]/40 hover:text-[#0F766E]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <ReservationFilters
          date={dateFilter}
          serviceId={serviceIdFilter}
          services={services}
        />

        <ReservasTable reservations={reservations} emptyMessage={emptyMessage} />

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
