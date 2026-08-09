import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/generated/prisma/enums";
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

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login?callbackURL=/admin");
  }

  const now = new Date();
  const today = new Date(now.toDateString());
  const tomorrow = new Date(today.getTime() + 86_400_000);

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
          gte: today,
          lt: tomorrow,
        },
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
      },
    }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.professional.count({ where: { isActive: true } }),
    prisma.reservation.aggregate({
      where: {
        startAt: {
          gte: today,
          lt: tomorrow,
        },
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
      },
      _sum: { servicePrice: true },
    }),
    prisma.reservation.count({ where: { status: ReservationStatus.PENDING } }),
    prisma.reservation.findMany({
      where: {
        startAt: { gte: now },
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
      },
      include: {
        customer: true,
        service: true,
        professional: true,
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
        createdAt: true,
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
      href: "/admin/agenda",
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
            Bienvenido, {session.user.name ?? "administrador"}
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
                      {reservation.customer.name} • {dateFormatter.format(reservation.startAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
                    {reservation.status}
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
