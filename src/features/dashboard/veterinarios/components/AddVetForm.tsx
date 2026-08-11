"use client";

import {
  type ReactNode,
  useActionState,
  useEffect,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Service } from "@/generated/prisma/client";
import { VetFormContext } from "./VetFormContext";
import {
  createVetAction,
  type VetActionState,
} from "../actions/veterinarios-actions";
import { confirmSwal, swalSummaryHtml } from "@/shared/utils/sweetAlert";

type AddVetFormProps = {
  services: Pick<Service, "id" | "name" | "slug" | "durationMin">[];
  successRedirectHref?: string;
  onSuccess?: () => void;
  children: ReactNode;
};

const initial: VetActionState = { status: "idle", message: "" };

export default function AddVetForm({
  services,
  successRedirectHref,
  onSuccess,
  children,
}: AddVetFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createVetAction, initial);

  const formKey =
    state.status === "error" && state.values
      ? `vet-create-error-${JSON.stringify(state.values)}`
      : "vet-create-new";

  useEffect(() => {
    if (!state.message) return;
    if (state.status === "success") {
      toast.success(state.message);
      if (successRedirectHref) router.push(successRedirectHref);
      else router.refresh();
      onSuccess?.();
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [onSuccess, router, state.message, state.status, successRedirectHref]);

  const handleSubmit = async (formData: FormData) => {
    const result = await confirmSwal({
      title: "Crear profesional",
      html: swalSummaryHtml([
        { label: "Nombre", value: formData.get("name")?.toString() },
        { label: "Rol", value: formData.get("role") === "GROOMING" ? "Peluquería y baño" : "Veterinario/a" },
        { label: "Estado", value: formData.get("isActive") === "on" ? "Activo" : "Inactivo" },
      ]),
      icon: "question",
      confirmButtonText: "Crear profesional",
    });
    if (!result.isConfirmed) return;
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <VetFormContext.Provider
      value={{ services, state, isPending, formKey, onSubmit: handleSubmit }}
    >
      {children}
    </VetFormContext.Provider>
  );
}
