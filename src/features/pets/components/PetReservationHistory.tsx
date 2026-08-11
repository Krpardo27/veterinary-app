import { formatAppointmentDateTime } from "@/utils/dateFormatters";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "@/features/dashboard/reservas/components/reservationStatus";

type Reservation = {
  id: string;
  serviceName: string;
  startAt: Date;
  status: string;
  professional: { name: string } | null;
};

type PetReservationHistoryProps = {
  reservations: Reservation[];
};

export default function PetReservationHistory({
  reservations,
}: PetReservationHistoryProps) {
  return (
    <section className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">
        Historial de atención
      </p>
      <h2 className="mt-1 text-xl font-bold text-[#1D3A35]">Reservas</h2>

      {reservations.length === 0 ? (
        <p className="mt-4 text-sm text-[#6F817A]">
          Aún no hay reservas asociadas a esta mascota.
        </p>
      ) : (
        <div className="mt-5 divide-y divide-[#E7EFEB] border-y border-[#E7EFEB]">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="grid gap-1 py-4 text-sm sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center sm:gap-4"
            >
              <p className="font-semibold text-[#1D3A35]">{reservation.serviceName}</p>
              <p className="text-[#5C6F68]">
                {reservation.professional?.name ?? "Por asignar"}
              </p>
              <p className="text-[#5C6F68]">
                {formatAppointmentDateTime(reservation.startAt)}
              </p>
              <span
                className={`w-fit border px-2.5 py-1 text-xs font-semibold ${
                  RESERVATION_STATUS_STYLES[
                    reservation.status as keyof typeof RESERVATION_STATUS_STYLES
                  ]
                }`}
              >
                {
                  RESERVATION_STATUS_LABELS[
                    reservation.status as keyof typeof RESERVATION_STATUS_LABELS
                  ]
                }
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
