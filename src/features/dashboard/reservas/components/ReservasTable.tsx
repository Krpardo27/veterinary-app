import type { ReservationStatus } from "@/generated/prisma/enums";
import { ReservationTableItem } from "./reservation.types";
import ReservationMobileCard from "./ReservationMobileCard";
import ReservationStatusButtons from "./ReservationStatusButtons";


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

interface ReservasTableProps {
  reservations: ReservationTableItem[];
}

export default function ReservasTable({ reservations }: ReservasTableProps) {
  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
        <p className="text-sm text-zinc-400">No hay reservas que coincidan.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-zinc-700 whitespace-nowrap">Fecha</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-700 whitespace-nowrap">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-700 whitespace-nowrap">Servicio</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-700 whitespace-nowrap">Profesional</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-700 whitespace-nowrap">Precio</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-700 whitespace-nowrap">Estado</th>
                <th className="px-5 py-3 text-right font-semibold text-zinc-700 whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-3 text-zinc-900">
                    <p className="font-medium">
                      {new Date(r.startAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "2-digit" })}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(r.startAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-900">{r.customer.name}</p>
                    <p className="text-xs text-zinc-500">{r.customer.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-zinc-700">{r.serviceName}</td>
                  <td className="px-5 py-3 text-zinc-700">
                    {r.professional?.name ?? <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-5 py-3 font-medium text-zinc-900">
                    ${r.servicePrice.toLocaleString("es-CL")}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <ReservationStatusButtons reservationId={r.id} status={r.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden space-y-4">
        {reservations.map((r) => (
          <ReservationMobileCard key={r.id} reservation={r} />
        ))}
      </div>
    </>
  );
}
