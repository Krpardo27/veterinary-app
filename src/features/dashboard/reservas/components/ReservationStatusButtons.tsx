"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Swal from "sweetalert2";
import type { ReservationStatus } from "@/generated/prisma/enums";
import { cancelReservationAction } from "@/features/dashboard/reservas/actions/cancel-reservation.action";
import { updateReservationStatusAction } from "@/features/dashboard/reservas/actions/update-reservation-status.action";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

export default function ReservationStatusButtons({
  reservationId,
  status,
}: {
  reservationId: string;
  status: ReservationStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isActive = status === "PENDING" || status === "CONFIRMED";

  if (!isActive) {
    return null;
  }

  async function updateStatus(targetStatus: ReservationStatus) {
    const confirm = await Swal.fire({
      title: "Actualizar estado",
      text: `¿Marcar cita como ${STATUS_LABEL[targetStatus]}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#16a34a",
      background: "#111111",
      color: "#f4f4f5",
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await updateReservationStatusAction(reservationId, targetStatus);

      if (result?.error) {
        await Swal.fire({
          title: "No se pudo actualizar",
          text: result.error,
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc2626",
          background: "#111111",
          color: "#f4f4f5",
        });
        return;
      }

      await Swal.fire({
        title: "Estado actualizado",
        text: `La cita quedó como ${STATUS_LABEL[targetStatus]}.`,
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#16a34a",
        background: "#111111",
        color: "#f4f4f5",
      });

      router.refresh();
    });
  }

  async function runAction({
    action,
    title,
    text,
    confirmButtonText,
    successTitle,
    successText,
    confirmButtonColor,
  }: {
    action: () => Promise<{ success?: boolean; error?: string }>;
    title: string;
    text: string;
    confirmButtonText: string;
    successTitle: string;
    successText: string;
    confirmButtonColor: string;
  }) {
    const confirm = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: "Volver",
      confirmButtonColor,
      background: "#111111",
      color: "#f4f4f5",
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await action();

      if (result.error) {
        await Swal.fire({
          title: "No se pudo actualizar",
          text: result.error,
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc2626",
          background: "#111111",
          color: "#f4f4f5",
        });
        return;
      }

      await Swal.fire({
        title: successTitle,
        text: successText,
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor,
        background: "#111111",
        color: "#f4f4f5",
      });

      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isActive && (
        <>
          <button
            type="button"
            disabled={isPending}
            onClick={() => updateStatus("COMPLETED")}
            className="rounded bg-blue-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Completada
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => updateStatus("NO_SHOW")}
            className="rounded bg-orange-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            No asistió
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction({
              action: () => cancelReservationAction(reservationId),
              title: "Cancelar reserva",
              text: "La cita quedará cancelada.",
              confirmButtonText: "Sí, cancelar",
              successTitle: "Reserva cancelada",
              successText: "La cita quedó cancelada.",
              confirmButtonColor: "#dc2626",
            })}
            className="rounded bg-red-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
}
