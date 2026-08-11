import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/generated/prisma/enums";
import {
  ACTIVE_RESERVATION_STATUSES,
  getDayRange,
} from "@/features/booking/services/availability";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "@/features/dashboard/reservas/components/reservationStatus";
import { getBusinessDateOnly } from "@/shared/utils/businessTime";
import { formatAppointmentDateTime } from "@/utils/dateFormatters";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiScissors,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default async function AdminPage() {
  const now = new Date();
  const todayRange = getDayRange(getBusinessDateOnly());

  const [
    customersCount,
    reservationsTodayCount,
    servicesActiveCount,
    professionalsActiveCount,
    todaysRevenue,
    pendingReservationsCount,
    upcomingReservations,
    recentCustomers,
  ] = await Promise.all([
    prisma.customer.count({ where: { isActive: true } }),
    prisma.reservation.count({
      where: {
        startAt: {
          gte: todayRange.dayStart,
          lte: todayRange.dayEnd,
        },
        status: { in: ACTIVE_RESERVATION_STATUSES },
      },
    }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.professional.count({ where: { isActive: true } }),
    prisma.reservation.aggregate({
      where: {
        startAt: {
          gte: todayRange.dayStart,
          lte: todayRange.dayEnd,
        },
        status: { in: ACTIVE_RESERVATION_STATUSES },
      },
      _sum: { servicePrice: true },
    }),
    prisma.reservation.count({ where: { status: ReservationStatus.PENDING } }),
    prisma.reservation.findMany({
      where: {
        startAt: { gte: now },
        status: { in: ACTIVE_RESERVATION_STATUSES },
      },
      select: {
        id: true,
        serviceName: true,
        startAt: true,
        status: true,
        customer: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { startAt: "asc" },
      take: 5,
    }),
    prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        name: true,
        phone: true,
      },
    }),
  ]);

  const stats = [
    {
      label: "Clientes registrados",
      value: customersCount,
      icon: FiUsers,
      href: "/admin/clientes",
    },
    {
      label: "Agenda de hoy",
      value: reservationsTodayCount,
      icon: FiCalendar,
      href: "/admin/agenda",
    },
    {
      label: "Servicios activos",
      value: servicesActiveCount,
      icon: FiScissors,
      href: "/admin/servicios",
    },
    {
      label: "Profesionales activos",
      value: professionalsActiveCount,
      icon: FiUserCheck,
      href: "/admin/veterinarios",
    },
    {
      label: "Reservas pendientes",
      value: pendingReservationsCount,
      icon: FiClock,
      href: "/admin/reservas?status=PENDING",
    },
    {
      label: "Ingresos de hoy",
      value: currencyFormatter.format(todaysRevenue._sum.servicePrice || 0),
      icon: FiDollarSign,
      href: "/admin/agenda",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#0F172A]">Dashboard veterinario</h2>
          <p className="mt-2 text-[#64748B]">
            Resumen operativo del centro veterinario.
          </p>
        </div>

        <Link
          href="/admin/agenda"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#115E59]"
        >
          Ver agenda
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link key={stat.label} href={stat.href}>
              <div className="group cursor-pointer rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)] transition-all hover:border-[#0F766E]/30">
                <div className="mb-3 inline-flex rounded-lg bg-[#D1FAE5] p-2">
                  <Icon className="h-5 w-5 text-[#0F766E]" />
                </div>
                <p className="text-sm text-[#64748B] transition-colors group-hover:text-[#0F766E]">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] p-5">
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A]">Próximas reservas</h3>
              <p className="mt-1 text-sm text-[#64748B]">Citas activas desde ahora.</p>
            </div>
            <Link href="/admin/reservas" className="text-sm font-medium text-[#0F766E] hover:text-[#115E59]">
              Ver todas
            </Link>
          </div>

          {upcomingReservations.length === 0 ? (
            <div className="p-6 text-sm text-[#64748B]">
              No hay reservas próximas registradas por el momento.
            </div>
          ) : (
            <ul className="divide-y divide-[#E2E8F0]">
              {upcomingReservations.map((reservation) => (
                <li key={reservation.id} className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold text-[#0F172A]">
                      {reservation.service?.name ?? reservation.serviceName}
                    </p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {reservation.customer.name} • {formatAppointmentDateTime(reservation.startAt)}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${RESERVATION_STATUS_STYLES[reservation.status]}`}>
                    {RESERVATION_STATUS_LABELS[reservation.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)]">
            <h3 className="text-lg font-semibold text-[#0F172A]">Centro veterinario</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#64748B]">Nombre</span>
                <span className="font-medium text-[#0F172A]">Clínica Vet</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#64748B]">Estado</span>
                <span className="rounded-full bg-[#D1FAE5] px-2.5 py-1 text-xs font-semibold uppercase text-[#0F766E]">
                  Operativo
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#64748B]">Modo</span>
                <span className="font-medium text-[#0F172A]">Gestión clínica</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)]">
            <h3 className="text-lg font-semibold text-[#0F172A]">Clientes recientes</h3>

            {recentCustomers.length === 0 ? (
              <p className="mt-4 text-sm text-[#64748B]">Todavía no hay clientes registrados.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentCustomers.map((customer) => (
                  <li key={customer.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <p className="font-medium text-[#0F172A]">{customer.name}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{customer.phone}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
