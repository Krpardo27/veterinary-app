import type { ReservationStatus } from "@/generated/prisma/enums";
import type { ReservationTableItem } from "./reservation.types";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING:   "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW:   "No asistió",
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING:   "bg-amber-50  border-amber-200  text-amber-700",
  CONFIRMED: "bg-emerald-50 border-emerald-200 text-emerald-700",
  COMPLETED: "bg-zinc-100  border-zinc-200   text-zinc-600",
  CANCELLED: "bg-red-50    border-red-200    text-red-600",
  NO_SHOW:   "bg-orange-50 border-orange-200 text-orange-700",
};

export default function ReservationMobileCard({ reservation }: { reservation: ReservationTableItem }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{reservation.customer.name}</p>
          <p className="text-xs text-zinc-500">{reservation.customer.phone}</p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[reservation.status]}`}>
          {STATUS_LABELS[reservation.status]}
        </span>
      </div>

      <div className="space-y-1 text-sm text-zinc-700">
        <p><span className="text-zinc-400">Servicio: </span>{reservation.serviceName}</p>
        <p><span className="text-zinc-400">Veterinario: </span>{reservation.veterinarian?.name ?? "—"}</p>
        <p>
          <span className="text-zinc-400">Fecha: </span>
          {new Date(reservation.startAt).toLocaleString("es-CL", {
            day: "2-digit", month: "short", year: "2-digit",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
        <p className="font-semibold text-zinc-900">${reservation.servicePrice.toLocaleString("es-CL")}</p>
      </div>
    </div>
  );
}
