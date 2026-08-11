"use client";

import { useEffect, useRef, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import type { Service } from "@/generated/prisma/client";
import AddVetForm from "./AddVetForm";
import VetAdminForm from "./VetAdminForm";

type CreateVetButtonProps = {
  services: Pick<Service, "id" | "name" | "slug" | "durationMin">[];
};

export default function CreateVetButton({ services }: CreateVetButtonProps) {
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
        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] sm:w-auto"
      >
        <FiPlus className="h-4 w-4" />
        Crear Profesional
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm sm:py-10">
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar formulario"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              <FiX className="h-4 w-4" />
            </button>

            <AddVetForm services={services} onSuccess={() => setIsOpen(false)}>
              <VetAdminForm />
            </AddVetForm>
          </div>
        </div>
      ) : null}
    </>
  );
}
