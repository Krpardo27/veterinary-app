import { ReservationStatus } from "@/generated/prisma/enums";
import AgendaHeader from "@/features/dashboard/agenda/components/AgendaHeader";
import AgendaReservationList from "@/features/dashboard/agenda/components/AgendaReservationList";
import AgendaStats from "@/features/dashboard/agenda/components/AgendaStats";
import AgendaTimeGrid from "@/features/dashboard/agenda/components/AgendaTimeGrid";
import {
  addDays,
  buildDailySlots,
  isValidDateInput,
} from "@/features/dashboard/agenda/components/agenda.utils";
import type {
  AgendaReservation,
  AgendaProfessional,
} from "@/features/dashboard/agenda/components/agenda.types";
import {
  ACTIVE_RESERVATION_STATUSES,
  getDayRange,
} from "@/features/booking/services/availability";
import { prisma } from "@/lib/prisma";
import { getBusinessDateOnly } from "@/shared/utils/businessTime";

const UPCOMING_RESERVATIONS_LIMIT = 100;

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; view?: string }>;
}) {
  const { date, view } = await searchParams;
  const today = getBusinessDateOnly();
  const hasInvalidDate = Boolean(date) && !isValidDateInput(date);
  const activeDate = isValidDateInput(date) ? date : today;
  const isUpcomingView = view === "upcoming";
  const dayRange = getDayRange(activeDate)!;
  const fromDate = isUpcomingView ? new Date() : dayRange.dayStart;
  const toDate = isUpcomingView
    ? getDayRange(addDays(today, 14))!.dayEnd
    : dayRange.dayEnd;

  const [reservations, professionals]: [
    AgendaReservation[],
    AgendaProfessional[],
  ] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        status: { in: ACTIVE_RESERVATION_STATUSES },
        startAt: { gte: fromDate, lte: toDate },
      },
      orderBy: { startAt: "asc" },
      ...(isUpcomingView && { take: UPCOMING_RESERVATIONS_LIMIT }),
      select: {
        id: true,
        serviceName: true,
        servicePrice: true,
        startAt: true,
        endAt: true,
        status: true,
        customer: { select: { name: true } },
        pet: { select: { name: true } },
        professional: { select: { id: true, name: true } },
      },
    }),
    prisma.professional.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === ReservationStatus.PENDING,
  ).length;
  const estimatedRevenue = reservations.reduce(
    (total, reservation) => total + reservation.servicePrice,
    0,
  );
  const slots = buildDailySlots(activeDate);

  return (
    <div className="space-y-6">
      <AgendaHeader
        activeDate={activeDate}
        today={today}
        tomorrow={addDays(today, 1)}
        isUpcomingView={isUpcomingView}
        selectedDate={dayRange.dayStart}
        dateError={hasInvalidDate ? "Selecciona una fecha válida." : undefined}
      />
      <AgendaStats
        reservationsCount={reservations.length}
        pendingCount={pendingCount}
        estimatedRevenue={estimatedRevenue}
        reservationsLabel={isUpcomingView ? "Reservas próximas" : "Reservas del día"}
        revenueLabel={isUpcomingView ? "Ingreso estimado 14 días" : "Ingreso estimado"}
      />
      {isUpcomingView ? (
        <AgendaReservationList reservations={reservations} />
      ) : slots ? (
        <AgendaTimeGrid
          slots={slots}
          reservations={reservations}
          professionals={professionals}
        />
      ) : (
        <section className="border border-dashed border-[#B9D9CF] bg-[#F7FAF9] p-6 text-sm text-[#5C6F68]">
          La clínica no atiende los domingos.
        </section>
      )}
    </div>
  );
}
