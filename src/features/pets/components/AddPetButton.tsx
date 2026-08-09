"use client";

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import PetForm from "./PetForm";

type Props = {
  customerId: string;
  customerName: string;
};

export default function AddPetButton({ customerId, customerName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 items-center justify-center gap-1.5 border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
      >
        <FiPlus className="size-4" />
        Mascota
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D3A35]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="pet-form-title">
          <div className="w-full max-w-md border border-[#DCE8E2] bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
                  Cliente
                </p>
                <h2 id="pet-form-title" className="mt-1 text-xl font-bold text-[#1D3A35]">
                  Añadir mascota a {customerName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-9 items-center justify-center text-[#52736A] transition-colors hover:bg-[#F0F8F5] hover:text-[#1D554A]"
                aria-label="Cerrar formulario de mascota"
              >
                <FiX className="size-5" />
              </button>
            </div>

            <PetForm customerId={customerId} onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
