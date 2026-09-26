"use client";

import { useEffect, useRef, useState } from "react";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 cursor-pointer items-center gap-1.5 border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
      >
        <FiEdit3 className="size-4" />
        Editar perfil
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#1D3A35]/40 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="edit-pet-title">
          <button
            type="button"
            aria-label="Cerrar edición de mascota"
            tabIndex={-1}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 cursor-default"
          />
          <div className="relative my-4 max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#DCE8E2] bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">Perfil de mascota</p>
                <h2 id="edit-pet-title" className="mt-1 text-xl font-bold text-[#1D3A35]">Editar {pet.name}</h2>
              </div>
              <button type="button" ref={closeButtonRef} onClick={() => setIsOpen(false)} aria-label="Cerrar edición de mascota" className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#52736A] transition-colors hover:bg-[#F0F8F5] hover:text-[#1D554A] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20">
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
