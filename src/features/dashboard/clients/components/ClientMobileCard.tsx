import Link from "next/link";
import { FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import type { ClientTableCustomer } from "./client.types";

interface ClientMobileCardProps {
  customer: ClientTableCustomer;
}

export default function ClientMobileCard({ customer }: ClientMobileCardProps) {
  const nextReservation = customer.reservations[0];

  return (
    <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-lg font-semibold text-[#0F172A]">
            {customer.name}
          </h3>
          <p className="mt-1 text-xs text-[#64748B]">
            Registrado: {customer.createdAtLabel}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#D1FAE5] px-2 py-1 text-xs font-medium text-[#0F766E]">
          <FiCalendar className="h-3 w-3 shrink-0" />
          <span className="font-semibold">{customer.reservations.length}</span>
        </span>
      </div>

      <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
        <div className="flex items-center gap-2">
          <FiPhone className="h-4 w-4 text-[#C8A96E] shrink-0" />
          <a
            href={`tel:${customer.phone}`}
            className="text-sm text-[#0F172A] transition-colors hover:text-[#0F766E]"
          >
            {customer.phone}
          </a>
        </div>
        {customer.email && (
          <div className="flex items-center gap-2">
            <FiMail className="h-4 w-4 shrink-0 text-[#0F766E]" />
            <a
              href={`mailto:${customer.email}`}
              className="truncate text-sm text-[#0F172A] transition-colors hover:text-[#0F766E]"
            >
              {customer.email}
            </a>
          </div>
        )}
      </div>

      {nextReservation ? (
        <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-[#64748B]">
              Proxima cita
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
          <p className="text-xs italic text-[#64748B]">Sin cita activa</p>
        </div>
      )}

      <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
        <Link
          href={`/admin/clientes/${customer.id}`}
          className="inline-flex h-9 items-center justify-center border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
        >
          Ver ficha
        </Link>
      </div>
    </div>
  );
}
