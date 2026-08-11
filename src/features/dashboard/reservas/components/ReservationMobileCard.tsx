import type { ReservationTableItem } from "./reservation.types";
import ReservationStatusButtons from "./ReservationStatusButtons";
import { formatAppointmentDateTime } from "@/utils/dateFormatters";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "./reservationStatus";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function ReservationMobileCard({ reservation }: { reservation: ReservationTableItem }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{reservation.customer.name}</p>
          <p className="text-xs text-zinc-500">{reservation.customer.phone}</p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RESERVATION_STATUS_STYLES[reservation.status]}`}>
          {RESERVATION_STATUS_LABELS[reservation.status]}
        </span>
      </div>

      <div className="space-y-1 text-sm text-zinc-700">
        <p><span className="text-zinc-400">Servicio: </span>{reservation.serviceName}</p>
        <p><span className="text-zinc-400">Duración: </span>{reservation.durationMin} min</p>
        <p><span className="text-zinc-400">Profesional: </span>{reservation.professional?.name ?? "—"}</p>
        <p>
          <span className="text-zinc-400">Fecha: </span>
          {formatAppointmentDateTime(reservation.startAt)}
        </p>
        <p className="font-semibold text-zinc-900">{currencyFormatter.format(reservation.servicePrice)}</p>
      </div>

      <ReservationStatusButtons reservationId={reservation.id} status={reservation.status} variant="compact" />
    </div>
  );
}
