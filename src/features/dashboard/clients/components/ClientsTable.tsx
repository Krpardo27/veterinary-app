import Link from "next/link";
import { FiArrowRight, FiCalendar, FiMail, FiPhone, FiUser } from "react-icons/fi";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "@/features/dashboard/reservas/components/reservationStatus";
import ClientMobileCard from "./ClientMobileCard";
import type { ClientTableCustomer } from "./client.types";

interface ClientsTableProps {
  customers: ClientTableCustomer[];
  emptyMessage?: string;
}

export default function ClientsTable({
  customers,
  emptyMessage = "No hay clientes registrados aún.",
}: ClientsTableProps) {
  return (
    <>
      {/* Desktop: Tabla */}
      {customers.length === 0 ? (
        <div className="hidden md:block rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-[#0F766E] shadow-sm">
            <FiUser className="size-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-700">{emptyMessage}</p>
        </div>
      ) : (
        <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:block">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 bg-white px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Clientes activos</h2>
              <p className="mt-1 text-xs text-zinc-500">Contacto, próxima cita y ficha clínica.</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0F766E]">
              {customers.length} en esta página
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50/80">
                <tr>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Cliente
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Contacto
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Citas activas
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Próxima cita
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Registrado
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {customers.map((customer) => {
                  const nextReservation = customer.reservations[0];

                  return (
                    <tr
                      key={customer.id}
                      className="transition-colors hover:bg-zinc-50"
                    >
                      <td className="px-5 py-4">
                        <div className="min-w-48">
                          <Link
                            href={`/admin/clientes/${customer.id}`}
                            className="font-semibold text-zinc-900 hover:text-[#0F766E]"
                          >
                            {customer.name}
                          </Link>
                          {customer.notes && (
                            <p className="mt-1 max-w-56 truncate text-xs text-zinc-500">
                              {customer.notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-700">
                        <div className="space-y-1.5">
                          <a href={`tel:${customer.phone}`} className="flex items-center gap-2 hover:text-[#0F766E]">
                            <FiPhone className="h-4 w-4 shrink-0 text-[#0F766E]" />
                            <span>{customer.phone}</span>
                          </a>
                          {customer.email ? (
                            <a href={`mailto:${customer.email}`} className="flex items-center gap-2 hover:text-[#0F766E]">
                              <FiMail className="h-4 w-4 shrink-0 text-[#0F766E]" />
                              <span className="max-w-56 truncate">{customer.email}</span>
                            </a>
                          ) : (
                            <p className="flex items-center gap-2 text-zinc-400">
                              <FiMail className="h-4 w-4 shrink-0" />
                              <span>Sin email</span>
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${customer.activeReservationsCount > 0 ? "border-emerald-200 bg-emerald-50 text-[#0F766E]" : "border-zinc-200 bg-zinc-50 text-zinc-500"}`}>
                          <FiCalendar className="h-3 w-3 shrink-0" />
                          <span>{customer.activeReservationsCount}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {nextReservation ? (
                          <div className="min-w-56 space-y-2">
                            <div>
                              <p className="font-medium text-zinc-900">{nextReservation.serviceName}</p>
                              <p className="mt-1 text-xs text-zinc-500">{nextReservation.startAtLabel}</p>
                            </div>
                            <span className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RESERVATION_STATUS_STYLES[nextReservation.status]}`}>
                              {RESERVATION_STATUS_LABELS[nextReservation.status]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs italic text-zinc-400">Sin cita activa</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-zinc-500">
                        {customer.createdAtLabel}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/clientes/${customer.id}`}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
                        >
                          Ver ficha
                          <FiArrowRight className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile: Cards */}
      <div className="block md:hidden space-y-4">
        {customers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-[#0F766E] shadow-sm">
              <FiUser className="size-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-700">{emptyMessage}</p>
          </div>
        ) : (
          customers.map((customer) => (
            <ClientMobileCard key={customer.id} customer={customer} />
          ))
        )}
      </div>
    </>
  );
}
