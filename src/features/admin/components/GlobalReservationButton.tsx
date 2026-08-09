"use client";

import { useState } from "react";
import { FiCalendar, FiPlus, FiX } from "react-icons/fi";
import { toast } from "sonner";

import ReservationForm from "@/features/booking/components/ReservationForm";
import type { ProfessionalRole } from "@/features/booking/serviceRoles";
import type { Service } from "@/generated/prisma/client";

type GlobalReservationButtonProps = {
  services: Service[];
  professionals: Array<{
    id: string;
    name: string;
    role: ProfessionalRole;
    serviceIds: string[];
  }>;
};

export default function GlobalReservationButton({
  services,
  professionals,
}: GlobalReservationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    toast.success("Reserva creada correctamente");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-xl bg-[#0F766E] px-4 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#115E59] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2 lg:bottom-6 lg:right-6"
      >
        <FiPlus className="size-5" />
        Nueva reserva
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Cerrar creación de reserva"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#0F172A]/30"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-reservation-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4 sm:px-7 sm:py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
                  Atención telefónica o presencial
                </p>
                <h2 id="global-reservation-title" className="mt-1 text-xl font-bold text-[#0F172A]">
                  Nueva reserva
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setIsOpen(false)}
                className="flex size-10 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F766E]"
              >
                <FiX className="size-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
              <div className="mb-6 flex items-center gap-2 border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm text-[#115E59]">
                <FiCalendar className="size-4 shrink-0" />
                Selecciona servicio, horario y datos del cliente.
              </div>
              <ReservationForm
                services={services}
                professionals={professionals}
                variant="admin"
                onSuccess={handleSuccess}
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}