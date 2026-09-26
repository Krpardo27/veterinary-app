"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { FiFolderPlus, FiX } from "react-icons/fi";
import { toast } from "sonner";
import FormErrors from "@/shared/ui/FormErrors";
import {
  createCategoryAction,
  type CategoryActionState,
} from "../actions/category-actions";

const initialState: CategoryActionState = { status: "idle", message: "" };

const inputClassName =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20";

const CATEGORY_PRESETS = [
  {
    name: "Consulta general",
    slug: "consulta-general",
    description: "Consultas veterinarias preventivas y diagnósticas",
  },
  {
    name: "Vacunación",
    slug: "vacunacion",
    description: "Vacunas, desparasitación y prevención",
  },
  {
    name: "Peluquería y baño",
    slug: "peluqueria",
    description: "Baño, corte, cepillado y cuidado del pelaje",
  },
  {
    name: "Cirugía",
    slug: "cirugia",
    description: "Procedimientos quirúrgicos y esterilización",
  },
  {
    name: "Laboratorio",
    slug: "laboratorio",
    description: "Exámenes clínicos y toma de muestras",
  },
] as const;

export default function CreateCategoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialState);

  const resetForm = useCallback(() => {
    setName("");
    setSlug("");
    setDescription("");
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (!state.message) return;

    if (state.status === "success") {
      toast.success(state.message);
      const timeoutId = window.setTimeout(() => closeModal(), 0);
      return () => window.clearTimeout(timeoutId);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [closeModal, state.message, state.status]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#0F766E]/30 px-4 text-xs font-bold uppercase tracking-wide text-[#0F766E] transition-colors hover:border-[#0F766E] hover:bg-[#0F766E]/5 sm:w-auto"
      >
        <FiFolderPlus className="h-4 w-4" />
        Crear categoría
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-md sm:py-10">
          <button
            type="button"
            aria-label="Cerrar formulario de categoría"
            tabIndex={-1}
            onClick={closeModal}
            className="absolute inset-0 cursor-default"
          />
          <form action={formAction} className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-7">
            <button
              type="button"
              ref={closeButtonRef}
              onClick={closeModal}
              aria-label="Cerrar formulario"
              className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            >
              <FiX className="h-4 w-4" />
            </button>

            <div className="pr-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0F766E]">
                Catálogo
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                Crear categoría
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Agrupa servicios por tipo de atención, como vacunación, cirugía o peluquería.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Sugerencias rápidas
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_PRESETS.map((preset) => (
                    <button
                      key={preset.slug}
                      type="button"
                      onClick={() => {
                        setName(preset.name);
                        setSlug(preset.slug);
                        setDescription(preset.description);
                      }}
                      className="inline-flex h-8 cursor-pointer items-center rounded-full border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <label className="space-y-2 text-sm font-medium text-zinc-700">
                <span>Nombre</span>
                <input name="name" minLength={2} value={name} onChange={(event) => setName(event.currentTarget.value)} className={inputClassName} placeholder="Vacunación" />
                {state.fieldErrors?.name?.[0] && <FormErrors>{state.fieldErrors.name[0]}</FormErrors>}
              </label>

              <label className="space-y-2 text-sm font-medium text-zinc-700">
                <span>URL pública</span>
                <input name="slug" value={slug} onChange={(event) => setSlug(event.currentTarget.value)} className={inputClassName} placeholder="vacunacion" />
                <p className="text-xs leading-5 text-zinc-500">
                  Si lo dejas vacío, se genera desde el nombre.
                </p>
                {state.fieldErrors?.slug?.[0] && <FormErrors>{state.fieldErrors.slug[0]}</FormErrors>}
              </label>

              <label className="space-y-2 text-sm font-medium text-zinc-700">
                <span>Descripción</span>
                <textarea name="description" rows={3} value={description} onChange={(event) => setDescription(event.currentTarget.value)} className={`${inputClassName} h-auto resize-none py-3`} />
                {state.fieldErrors?.description?.[0] && <FormErrors>{state.fieldErrors.description[0]}</FormErrors>}
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 px-5 text-xs font-bold uppercase tracking-wide text-zinc-600 transition-colors hover:bg-zinc-50 sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-[#0F766E] px-5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isPending ? "Creando..." : "Crear categoría"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}