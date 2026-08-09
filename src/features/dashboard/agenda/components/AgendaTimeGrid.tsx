import { formatTwentyFourHourTime } from "@/utils/dateFormatters";
import type {
  AgendaProfessional,
  AgendaReservation,
  AgendaSlot,
} from "./agenda.types";

type Props = {
  slots: AgendaSlot[];
  reservations: AgendaReservation[];
  professionals: AgendaProfessional[];
};

const SLOT_HEIGHT = 56;

function ReservationCard({ reservation }: { reservation: AgendaReservation }) {
  return (
    <div className="h-full overflow-hidden border-l-4 border-[#0F766E] bg-[#EAF4F1] px-2 py-1.5 text-xs text-[#1D3A35] shadow-sm">
      <p className="truncate font-semibold">{reservation.serviceName}</p>
      <p className="truncate text-[#52736A]">
        <span className="font-medium text-[#1D3A35]">{reservation.customer.name}</span>
        {reservation.pet && ` · ${reservation.pet.name}`}
      </p>
    </div>
  );
}

export default function AgendaTimeGrid({
  slots,
  reservations,
  professionals,
}: Props) {
  const unassignedReservations = reservations.filter(
    (reservation) => reservation.professional === null,
  );
  const columns = unassignedReservations.length > 0
    ? [...professionals, { id: "unassigned", name: "Sin asignar" }]
    : professionals;
  const dayStart = slots[0]?.start;
  const gridHeight = slots.length * SLOT_HEIGHT;
  const gridTemplateColumns = `5rem repeat(${columns.length}, minmax(10rem, 1fr))`;

  if (!dayStart) return null;

  return (
    <section className="border border-[#DCE8E2] bg-white">
      <div className="flex items-center justify-between border-b border-[#E7EFEB] px-4 py-3 sm:px-5">
        <div>
          <h3 className="font-semibold text-[#1D3A35]">Agenda del día</h3>
          <p className="mt-0.5 text-xs text-[#6F817A]">Reservas por profesional</p>
        </div>
        <span className="text-xs font-semibold text-[#0F766E]">{reservations.length} activas</span>
      </div>

      <div className="space-y-4 p-4 md:hidden">
        {columns.map((column) => {
          const columnReservations = reservations.filter((reservation) =>
            column.id === "unassigned"
              ? reservation.professional === null
              : reservation.professional?.id === column.id,
          );

          return (
            <section key={column.id} className="border border-[#DCE8E2]">
              <div className="flex items-center justify-between border-b border-[#E7EFEB] bg-[#F7FAF9] px-3 py-2">
                <p className="text-sm font-semibold text-[#1D3A35]">{column.name}</p>
                <span className="text-xs font-semibold text-[#0F766E]">{columnReservations.length}</span>
              </div>
              {columnReservations.length === 0 ? (
                <p className="px-3 py-3 text-sm text-[#9AA9A3]">Sin reservas activas</p>
              ) : (
                <div className="divide-y divide-[#E7EFEB]">
                  {columnReservations.map((reservation) => (
                    <div key={reservation.id} className="grid grid-cols-[4.5rem_1fr] gap-3 px-3 py-3">
                      <p className="text-sm font-semibold text-[#0F766E]">{formatTwentyFourHourTime(reservation.startAt)}</p>
                      <div className="border-l-2 border-[#2A6A5D] bg-[#EAF4F1] px-3 py-2 text-sm">
                        <p className="font-semibold text-[#1D3A35]">{reservation.serviceName}</p>
                        <p className="mt-0.5 text-xs text-[#52736A]">{reservation.pet?.name ?? reservation.customer.name} · {reservation.customer.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-176" style={{ display: "grid", gridTemplateColumns }}>
          <div className="border-b border-[#E7EFEB] px-3 py-3 text-xs font-semibold uppercase tracking-widest text-[#52736A]">Hora</div>
          {columns.map((column) => (
            <div key={column.id} className="border-b border-l border-[#E7EFEB] px-3 py-3 text-sm font-semibold text-[#1D3A35]">
              {column.name}
            </div>
          ))}
        </div>

        <div className="min-w-176" style={{ display: "grid", gridTemplateColumns }}>
          <div style={{ height: gridHeight }}>
            {slots.map((slot) => (
              <div key={slot.start.toISOString()} className="flex h-14 items-start border-b border-[#E7EFEB] px-3 pt-2 text-xs font-semibold text-[#0F766E]">
                {formatTwentyFourHourTime(slot.start)}
              </div>
            ))}
          </div>

          {columns.map((column) => {
            const columnReservations = reservations.filter((reservation) =>
              column.id === "unassigned"
                ? reservation.professional === null
                : reservation.professional?.id === column.id,
            );

            return (
              <div key={column.id} className="relative border-l border-[#E7EFEB]" style={{ height: gridHeight }}>
                {slots.map((slot) => <div key={slot.start.toISOString()} className="h-14 border-b border-[#E7EFEB]" />)}
                {columnReservations.map((reservation) => {
                  const offsetMinutes = Math.max(0, (reservation.startAt.getTime() - dayStart.getTime()) / 60_000);
                  const durationMinutes = Math.max(30, (reservation.endAt.getTime() - reservation.startAt.getTime()) / 60_000);
                  const top = (offsetMinutes / 30) * SLOT_HEIGHT + 4;
                  const height = Math.max(SLOT_HEIGHT - 8, (durationMinutes / 30) * SLOT_HEIGHT - 8);

                  return (
                    <div key={reservation.id} className="absolute inset-x-1 z-10" style={{ top, height }}>
                      <ReservationCard reservation={reservation} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
