import Link from "next/link";
import type { ReservationStatus } from "@/generated/prisma/enums";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "@/features/dashboard/reservas/components/reservationStatus";
import { formatAppointmentDateTime } from "@/utils/dateFormatters";

type UpcomingReservation = {
  id: string;
  serviceName: string;
  startAt: Date;
  status: ReservationStatus;
  customer: { name: string };
  service: { name: string } | null;
};

type UpcomingReservationsPanelProps = {
  reservations: UpcomingReservation[];
};

export default function UpcomingReservationsPanel({ reservations }: UpcomingReservationsPanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] p-5">
        <div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Próximas reservas</h3>
          <p className="mt-1 text-sm text-[#64748B]">Citas activas desde ahora.</p>
        </div>
        <Link href="/admin/reservas" className="text-sm font-medium text-[#0F766E] hover:text-[#115E59]">
          Ver todas
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="p-6 text-sm text-[#64748B]">
          No hay reservas próximas registradas por el momento.
        </div>
      ) : (
        <ul className="divide-y divide-[#E2E8F0]">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-[#0F172A]">
                  {reservation.service?.name ?? reservation.serviceName}
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  {reservation.customer.name} - {formatAppointmentDateTime(reservation.startAt)}
                </p>
              </div>
              <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${RESERVATION_STATUS_STYLES[reservation.status]}`}>
                {RESERVATION_STATUS_LABELS[reservation.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}