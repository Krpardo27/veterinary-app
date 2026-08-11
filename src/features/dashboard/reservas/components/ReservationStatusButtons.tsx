"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ReservationStatus } from "@/generated/prisma/enums";
import { cancelReservationAction } from "@/features/dashboard/reservas/actions/cancel-reservation.action";
import { updateReservationStatusAction } from "@/features/dashboard/reservas/actions/update-reservation-status.action";
import { RESERVATION_STATUS_LABELS } from "./reservationStatus";
import { confirmSwal, feedbackSwal, swalSummaryHtml } from "@/shared/utils/sweetAlert";

export default function ReservationStatusButtons({
  reservationId,
  status,
  variant = "default",
}: {
  reservationId: string;
  status: ReservationStatus;
  variant?: "default" | "compact";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isActive = status === "PENDING" || status === "CONFIRMED";

  if (!isActive) {
    return null;
  }

  async function updateStatus(targetStatus: ReservationStatus) {
    const confirm = await confirmSwal({
      title: "Actualizar estado",
      html: swalSummaryHtml([
        { label: "Estado actual", value: RESERVATION_STATUS_LABELS[status] },
        { label: "Nuevo estado", value: RESERVATION_STATUS_LABELS[targetStatus] },
      ]),
      icon: "question",
      confirmButtonText: "Sí, guardar",
      confirmButtonColor: "#16a34a",
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await updateReservationStatusAction(reservationId, targetStatus);

      if (result?.error) {
        await feedbackSwal({
          title: "No se pudo actualizar",
          message: result.error,
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
        return;
      }

      await feedbackSwal({
        title: "Estado actualizado",
        message: `La cita quedó como ${RESERVATION_STATUS_LABELS[targetStatus]}.`,
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#16a34a",
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
    const confirm = await confirmSwal({
      title,
      message: text,
      icon: "warning",
      confirmButtonText,
      confirmButtonColor,
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await action();

      if (result.error) {
        await feedbackSwal({
          title: "No se pudo actualizar",
          message: result.error,
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
        return;
      }

      await feedbackSwal({
        title: successTitle,
        message: successText,
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor,
      });

      router.refresh();
    });
  }

  const buttonClass = variant === "compact"
    ? "rounded-lg px-2.5 py-1 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
    : "rounded px-3 py-1 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {isActive && (
        <>
          <button
            type="button"
            disabled={isPending}
            onClick={() => updateStatus("COMPLETED")}
            className={`${buttonClass} bg-blue-600 text-white`}
          >
            Completada
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => updateStatus("NO_SHOW")}
            className={`${buttonClass} bg-orange-600 text-white`}
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
            className={`${buttonClass} bg-red-600 text-white`}
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
}
