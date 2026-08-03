"use client";

import {
  type ReactNode,
  useActionState,
  useEffect,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type { Service } from "@/generated/prisma/client";
import { VetFormContext } from "./VetFormContext";
import {
  createVetAction,
  type VetActionState,
} from "../actions/veterinarios-actions";

type AddVetFormProps = {
  services: Pick<Service, "id" | "name" | "durationMin">[];
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
    const result = await Swal.fire({
      title: "Crear veterinario",
      text: "Se creará un nuevo veterinario en el equipo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Crear veterinario",
      cancelButtonText: "Volver",
      confirmButtonColor: "#0F766E",
      cancelButtonColor: "#6b7280",
      background: "#ffffff",
      color: "#0f172a",
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
