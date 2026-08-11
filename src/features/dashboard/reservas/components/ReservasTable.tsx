import { ReservationTableItem } from "./reservation.types";
import ReservationMobileCard from "./ReservationMobileCard";
import ReservationStatusButtons from "./ReservationStatusButtons";
import { formatAppointmentDateTime } from "@/utils/dateFormatters";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "./reservationStatus";

interface ReservasTableProps {
  reservations: ReservationTableItem[];
  emptyMessage?: string;
}

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function ReservasTable({
  reservations,
  emptyMessage = "No hay reservas que coincidan.",
}: ReservasTableProps) {
  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
        <p className="text-sm text-zinc-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:block">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Resultados</h2>
            <p className="mt-1 text-xs text-zinc-500">Reservas ordenadas para el contexto actual.</p>
          </div>
          <span className="rounded-full border border-[#0F766E]/20 bg-[#0F766E]/10 px-3 py-1 text-xs font-semibold text-[#0F766E]">
            {reservations.length} en esta página
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50">
              <tr>
                <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">Fecha</th>
                <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">Cliente</th>
                <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">Servicio</th>
                <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">Profesional</th>
                <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">Precio</th>
                <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">Estado</th>
                <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-zinc-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-3 text-zinc-900">
                    <p className="font-medium">{formatAppointmentDateTime(r.startAt)}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-900">{r.customer.name}</p>
                    <p className="text-xs text-zinc-500">{r.customer.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-zinc-700">
                    <p className="font-medium text-zinc-900">{r.serviceName}</p>
                    <p className="text-xs text-zinc-500">{r.durationMin} min</p>
                  </td>
                  <td className="px-5 py-3 text-zinc-700">
                    {r.professional?.name ?? <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-5 py-3 font-medium text-zinc-900">
                    {currencyFormatter.format(r.servicePrice)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RESERVATION_STATUS_STYLES[r.status]}`}>
                      {RESERVATION_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <ReservationStatusButtons reservationId={r.id} status={r.status} variant="compact" />
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
