"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { deleteVetAction } from "../actions/veterinarios-actions";
import { confirmSwal, swalSummaryHtml } from "@/shared/utils/sweetAlert";

type DeleteVetButtonProps = {
  vetId: string;
  vetName: string;
  reservationCount: number;
};

export default function DeleteVetButton({
  vetId,
  vetName,
  reservationCount,
}: DeleteVetButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasReservations = reservationCount > 0;

  const handleDelete = async () => {
    if (hasReservations) {
      toast.error("No se puede eliminar un profesional con reservas asociadas");
      return;
    }

    const result = await confirmSwal({
      title: "Eliminar profesional",
      html: swalSummaryHtml([
        { label: "Profesional", value: vetName },
        { label: "Acción", value: "Se eliminará definitivamente del equipo" },
      ]),
      icon: "warning",
      confirmButtonText: "Eliminar profesional",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    startTransition(async () => {
      const response = await deleteVetAction(vetId);

      if (response.status === "success") {
        toast.success(response.message);
        router.refresh();
        return;
      }

      toast.error(response.message);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending || hasReservations}
      title={hasReservations ? "No se puede eliminar un profesional con reservas asociadas" : undefined}
      className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-xs font-bold uppercase tracking-wide text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <FiTrash2 className="h-4 w-4" />
      {hasReservations ? "Eliminar bloqueado" : isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}