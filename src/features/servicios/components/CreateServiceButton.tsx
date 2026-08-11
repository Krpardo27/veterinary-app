"use client";

import { useEffect, useRef, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import type { Category } from "@/generated/prisma/client";
import ServiceAdminForm from "./ServiceAdminForm";

type CreateServiceButtonProps = {
  categories: Pick<Category, "id" | "name">[];
};

export default function CreateServiceButton({ categories }: CreateServiceButtonProps) {
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
        className="inline-flex cursor-pointer h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] sm:w-auto"
      >
        <FiPlus className="h-4 w-4" />
        Crear Servicio
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-md sm:py-10">
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar formulario"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-600 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-zinc-800 cursor-pointer sm:right-6 sm:top-6"
            >
              <FiX className="h-4 w-4" />
            </button>

            <ServiceAdminForm categories={categories} onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}