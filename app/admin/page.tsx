import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/generated/prisma/enums";
import {
  ACTIVE_RESERVATION_STATUSES,
  getDayRange,
} from "@/features/booking/services/availability";
import DashboardStatGrid, { type DashboardStat } from "@/features/dashboard/admin/components/DashboardStatGrid";
import UpcomingReservationsPanel from "@/features/dashboard/admin/components/UpcomingReservationsPanel";
import CenterStatusCard from "@/features/dashboard/admin/components/CenterStatusCard";
import RecentCustomersCard from "@/features/dashboard/admin/components/RecentCustomersCard";
import { getBusinessDateOnly } from "@/shared/utils/businessTime";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiScissors,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

export default async function AdminPage() {
  const now = new Date();
  const todayRange = getDayRange(getBusinessDateOnly());

  const [
    customersCount,
    reservationsTodayCount,
    servicesActiveCount,
    professionalsActiveCount,
    pendingReservationsCount,
    confirmedTodayCount,
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
    prisma.reservation.count({ where: { status: ReservationStatus.PENDING } }),
    prisma.reservation.count({
      where: {
        startAt: {
          gte: todayRange.dayStart,
          lte: todayRange.dayEnd,
        },
        status: ReservationStatus.CONFIRMED,
      },
    }),
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

  const stats: DashboardStat[] = [
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
      label: "Pendientes por confirmar",
      value: pendingReservationsCount,
      icon: FiClock,
      href: "/admin/reservas?status=PENDING",
    },
    {
      label: "Confirmadas hoy",
      value: confirmedTodayCount,
      icon: FiClock,
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

      <DashboardStatGrid stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <UpcomingReservationsPanel reservations={upcomingReservations} />

        <div className="space-y-6">
          <CenterStatusCard />
          <RecentCustomersCard customers={recentCustomers} />
        </div>
      </div>
    </div>
  );
}
