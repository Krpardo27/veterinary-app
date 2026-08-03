"use client";

import { FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import ClientMobileCard from "./ClientMobileCard";
import type { ClientTableCustomer } from "./client.types";
import { CancelReservationButton } from "./CancelReservationButton";
import DeleteCustomerButton from "./DeleteCustomerButton";

interface ClientsTableProps {
  customers: ClientTableCustomer[];
}

export default function ClientsTable({ customers }: ClientsTableProps) {
  return (
    <>
      {/* Desktop: Tabla */}
      {customers.length === 0 ? (
        <div className="hidden md:block rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-12 text-center">
          <p className="text-[#64748B]">No hay clientes registrados aún.</p>
        </div>
      ) : (
        <div className="hidden md:block overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-[#0F172A]">
                    Nombre
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-[#0F172A]">
                    Teléfono
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-[#0F172A]">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-[#0F172A]">
                    Reservas
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-[#0F172A]">
                    Registrado
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-[#0F172A]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {customers.map((customer) => {
                  const nextReservation = customer.reservations[0];

                  return (
                    <tr
                      key={customer.id}
                      className="transition-colors hover:bg-[#F8FAFC]"
                    >
                      <td className="px-6 py-4 font-medium text-[#0F172A]">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 text-[#0F172A]">
                        <div className="flex items-center gap-2">
                          <FiPhone className="h-4 w-4 shrink-0 text-[#0F766E]" />
                          <span>{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#0F172A]">
                        <div className="flex items-center gap-2">
                          <FiMail className="h-4 w-4 shrink-0 text-[#0F766E]" />
                          <span>{customer.email || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#D1FAE5] px-3 py-1 text-sm font-medium text-[#0F766E]">
                          <FiCalendar className="h-3 w-3 shrink-0" />
                          <span>{customer.reservations.length}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#64748B]">
                        {customer.createdAtLabel}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {nextReservation ? (
                            <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
                              <div>
                                <p className="mb-1 text-xs uppercase tracking-wide text-[#64748B]">
                                  Próxima cita
                                </p>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-[#0F172A]">
                                    {nextReservation.serviceName}
                                  </p>
                                  <p className="text-xs text-[#64748B]">
                                    {nextReservation.startAtLabel}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="border-t border-[#E2E8F0] pt-3">
                              <p className="text-xs italic text-[#64748B]">
                                Sin cita activa
                              </p>
                            </div>
                          )}
                          <div className="border-t border-white/5 pt-3 space-y-2">
                            {nextReservation ? (
                              <div className="flex justify-between w-full gap-2">
                                <CancelReservationButton
                                  reservationId={nextReservation.id}
                                />
                              </div>
                            ) : (
                              <DeleteCustomerButton
                                customerId={customer.id}
                                customerName={customer.name}
                              />
                            )}
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
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-12 text-center">
            <p className="text-[#64748B]">No hay clientes registrados aún.</p>
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
