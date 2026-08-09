"use client";

import Link from "next/link";
import { FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import ClientMobileCard from "./ClientMobileCard";
import type { ClientTableCustomer } from "./client.types";

interface ClientsTableProps {
  customers: ClientTableCustomer[];
}

export default function ClientsTable({ customers }: ClientsTableProps) {
  return (
    <>
      {/* Desktop: Tabla */}
      {customers.length === 0 ? (
        <div className="hidden md:block rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
          <p className="text-zinc-500">No hay clientes registrados aún.</p>
        </div>
      ) : (
        <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-zinc-900">
                    Nombre
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-zinc-900">
                    Teléfono
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-zinc-900">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-zinc-900">
                    Reservas
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-zinc-900">
                    Registrado
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-zinc-900">
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
                      <td className="px-6 py-4 font-medium text-zinc-900">
                        <div>
                          <Link
                            href={`/admin/clientes/${customer.id}`}
                            className="text-zinc-900 hover:underline"
                          >
                            {customer.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-700">
                        <div className="flex items-center gap-2">
                          <FiPhone className="h-4 w-4 shrink-0 text-[#0F766E]" />
                          <span>{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-700">
                        <div className="flex items-center gap-2">
                          <FiMail className="h-4 w-4 shrink-0 text-[#0F766E]" />
                          <span>{customer.email || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm font-medium text-[#0F766E]">
                          <FiCalendar className="h-3 w-3 shrink-0" />
                          <span>{customer.reservations.length}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {customer.createdAtLabel}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {nextReservation ? (
                            <div className="space-y-2 border-t border-zinc-100 pt-3">
                              <div>
                                <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
                                  Próxima cita
                                </p>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-zinc-900">
                                    {nextReservation.serviceName}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    {nextReservation.startAtLabel}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="border-t border-zinc-100 pt-3">
                              <p className="text-xs italic text-zinc-400">
                                Sin cita activa
                              </p>
                            </div>
                          )}
                          <div className="border-t border-zinc-100 pt-3 space-y-2">
                            <Link
                              href={`/admin/clientes/${customer.id}`}
                              className="inline-flex h-9 items-center justify-center border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
                            >
                              Ver ficha
                            </Link>
                          </div>
                        </div>
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
            <p className="text-zinc-500">No hay clientes registrados aún.</p>
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
