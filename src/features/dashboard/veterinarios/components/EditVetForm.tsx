"use client";

import { type ReactNode, useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type { ProfessionalService, Professional, Service } from "@/generated/prisma/client";
import { VetFormContext } from "./VetFormContext";
import { deleteVetAction, updateVetAction, type VetActionState } from "../actions/veterinarios-actions";

type EditVetFormProps = {
  vet: Professional & {
    services?: Pick<ProfessionalService, "serviceId" | "durationMin" | "isActive">[];
  };
  services: Pick<Service, "id" | "name" | "durationMin">[];
  successRedirectHref?: string;
  children: ReactNode;
};

const initial: VetActionState = { status: "idle", message: "" };

export default function EditVetForm({ vet, services, successRedirectHref, children }: EditVetFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateVetAction.bind(null, vet.id), initial);

  const formKey = state.status === "error" && state.values
    ? `vet-edit-error-${JSON.stringify(state.values)}`
    : `vet-edit-${vet.id}`;

  useEffect(() => {
    if (!state.message) return;
    if (state.status === "success") {
      toast.success(state.message);
      if (successRedirectHref) router.push(successRedirectHref);
      else router.refresh();
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [router, state.message, state.status, successRedirectHref]);

  const handleSubmit = async (formData: FormData) => {
    const result = await Swal.fire({
      title: "Guardar cambios",
      text: "Se actualizarán los datos de este profesional.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar cambios",
      cancelButtonText: "Volver",
      confirmButtonColor: "#0F766E",
      cancelButtonColor: "#6b7280",
      background: "#ffffff",
      color: "#0f172a",
    });
    if (!result.isConfirmed) return;
    startTransition(() => { formAction(formData); });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Eliminar profesional",
      text: `Esta acción eliminará a ${vet.name} del equipo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar profesional",
      cancelButtonText: "Volver",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      background: "#ffffff",
      color: "#0f172a",
    });
    if (!result.isConfirmed) return;
    startTransition(async () => {
      const response = await deleteVetAction(vet.id);
      if (response.status === "success") {
        toast.success(response.message);
        router.push(successRedirectHref ?? "/admin/veterinarios");
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <VetFormContext.Provider value={{ vet, services, state, isPending, formKey, onSubmit: handleSubmit, onDelete: handleDelete }}>
      {children}
    </VetFormContext.Provider>
  );
}
