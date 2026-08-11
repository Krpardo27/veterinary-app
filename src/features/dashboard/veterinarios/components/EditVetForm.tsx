"use client";

import { type ReactNode, useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ProfessionalService, Professional, Service } from "@/generated/prisma/client";
import { VetFormContext } from "./VetFormContext";
import { deactivateVetAction, deleteVetAction, updateVetAction, type VetActionState } from "../actions/veterinarios-actions";
import { confirmSwal, swalSummaryHtml } from "@/shared/utils/sweetAlert";

type EditVetFormProps = {
  vet: Professional & {
    services?: Pick<ProfessionalService, "serviceId" | "durationMin" | "isActive">[];
    _count?: { reservations: number };
  };
  services: Pick<Service, "id" | "name" | "slug" | "durationMin">[];
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
    const result = await confirmSwal({
      title: "Guardar cambios",
      html: swalSummaryHtml([
        { label: "Profesional", value: vet.name },
        { label: "Nuevo nombre", value: formData.get("name")?.toString() },
        { label: "Rol", value: formData.get("role") === "GROOMING" ? "Peluquería y baño" : "Veterinario/a" },
        { label: "Estado", value: formData.get("isActive") === "on" ? "Activo" : "Inactivo" },
      ]),
      icon: "question",
      confirmButtonText: "Guardar cambios",
    });
    if (!result.isConfirmed) return;
    startTransition(() => { formAction(formData); });
  };

  const handleDelete = async () => {
    const result = await confirmSwal({
      title: "Eliminar profesional",
      html: swalSummaryHtml([
        { label: "Profesional", value: vet.name },
        { label: "Acción", value: "Se eliminará del equipo" },
      ]),
      icon: "warning",
      confirmButtonText: "Eliminar profesional",
      confirmButtonColor: "#dc2626",
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

  const handleDeactivate = async () => {
    const result = await confirmSwal({
      title: "Desactivar profesional",
      html: swalSummaryHtml([
        { label: "Profesional", value: vet.name },
        { label: "Efecto", value: "No estará disponible para nuevas reservas" },
        { label: "Historial", value: "Se conservará sin cambios" },
      ]),
      icon: "warning",
      confirmButtonText: "Desactivar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    startTransition(async () => {
      const response = await deactivateVetAction(vet.id);
      if (response.status === "success") {
        toast.success(response.message);
        router.push(successRedirectHref ?? "/admin/veterinarios");
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <VetFormContext.Provider value={{ vet, services, state, isPending, formKey, onSubmit: handleSubmit, onDeactivate: handleDeactivate, onDelete: handleDelete }}>
      {children}
    </VetFormContext.Provider>
  );
}
