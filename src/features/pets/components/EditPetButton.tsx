"use client";

import { useState } from "react";
import { FiEdit3, FiX } from "react-icons/fi";

import PetForm from "./PetForm";

type Props = {
  customerId: string;
  pet: {
    id: string;
    name: string;
    species: "DOG" | "CAT" | "BIRD" | "OTHER";
    breed: string | null;
    sex: "MALE" | "FEMALE" | "UNKNOWN" | null;
    birthDate: Date | null;
    color: string | null;
    notes: string | null;
  };
};

export default function EditPetButton({ customerId, pet }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
      >
        <FiEdit3 className="size-4" />
        Editar perfil
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D3A35]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-pet-title">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto border border-[#DCE8E2] bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">Perfil de mascota</p>
                <h2 id="edit-pet-title" className="mt-1 text-xl font-bold text-[#1D3A35]">Editar {pet.name}</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar edición de mascota" className="flex size-9 items-center justify-center text-[#52736A] transition-colors hover:bg-[#F0F8F5] hover:text-[#1D554A]">
                <FiX className="size-5" />
              </button>
            </div>
            <PetForm customerId={customerId} pet={pet} onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
