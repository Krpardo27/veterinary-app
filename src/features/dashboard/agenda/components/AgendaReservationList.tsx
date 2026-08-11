import ReservationStatusButtons from "@/features/dashboard/reservas/components/ReservationStatusButtons";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "@/features/dashboard/reservas/components/reservationStatus";
import { formatLongDate, formatTwentyFourHourTime } from "@/utils/dateFormatters";
import type { AgendaReservation } from "./agenda.types";

type Props = {
  reservations: AgendaReservation[];
};

export default function AgendaReservationList({ reservations }: Props) {
  return (
    <section className="border border-[#DCE8E2] bg-white">
      <div className="border-b border-[#E7EFEB] px-5 py-4">
        <h3 className="font-semibold text-[#1D3A35]">Próximas reservas</h3>
      </div>
      {reservations.length === 0 ? (
        <p className="p-5 text-sm text-[#6F817A]">No hay reservas activas en los próximos 14 días.</p>
      ) : (
        <div className="divide-y divide-[#E7EFEB]">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="grid gap-3 px-5 py-4 text-sm lg:grid-cols-[1fr_1fr_1fr_auto_auto] lg:items-center lg:gap-4">
              <p className="font-semibold text-[#1D3A35]">{reservation.serviceName}</p>
              <p className="text-[#5C6F68]">{reservation.customer.name}{reservation.pet ? ` · ${reservation.pet.name}` : ""}</p>
              <p className="text-[#5C6F68]">{formatLongDate(reservation.startAt)} · {formatTwentyFourHourTime(reservation.startAt)}</p>
              <span className={`w-fit border px-2.5 py-1 text-xs font-semibold ${RESERVATION_STATUS_STYLES[reservation.status]}`}>
                {RESERVATION_STATUS_LABELS[reservation.status]}
              </span>
              <ReservationStatusButtons reservationId={reservation.id} status={reservation.status} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
