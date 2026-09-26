"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  const [pendingAction, setPendingAction] = useState<ReservationStatus | "CANCELLED" | null>(null);
  const [isPending, startTransition] = useTransition();
  const isActive = status === "PENDING" || status === "CONFIRMED";
  const isBusy = isPending || pendingAction !== null;

  if (!isActive) {
    return null;
  }

  async function updateStatus(targetStatus: ReservationStatus) {
    if (isBusy) return;

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

    setPendingAction(targetStatus);
    startTransition(async () => {
      try {
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
      } finally {
        setPendingAction(null);
      }
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
    if (isBusy) return;

    const confirm = await confirmSwal({
      title,
      message: text,
      icon: "warning",
      confirmButtonText,
      confirmButtonColor,
    });

    if (!confirm.isConfirmed) return;

    setPendingAction("CANCELLED");
    startTransition(async () => {
      try {
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
      } finally {
        setPendingAction(null);
      }
    });
  }

  const buttonClass = variant === "compact"
    ? "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    : "rounded px-3 py-1 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {isActive && (
        <>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => updateStatus("COMPLETED")}
            className={`${buttonClass} cursor-pointer bg-blue-600 text-white hover:bg-blue-700`}
          >
            {pendingAction === "COMPLETED" ? "Guardando..." : "Completada"}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => updateStatus("NO_SHOW")}
            className={`${buttonClass} cursor-pointer bg-orange-600 text-white hover:bg-orange-700`}
          >
            {pendingAction === "NO_SHOW" ? "Guardando..." : "No asistió"}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => runAction({
              action: () => cancelReservationAction(reservationId),
              title: "Cancelar reserva",
              text: "La cita quedará cancelada.",
              confirmButtonText: "Sí, cancelar",
              successTitle: "Reserva cancelada",
              successText: "La cita quedó cancelada.",
              confirmButtonColor: "#dc2626",
            })}
            className={`${buttonClass} cursor-pointer bg-red-600 text-white hover:bg-red-700`}
          >
            {pendingAction === "CANCELLED" ? "Cancelando..." : "Cancelar"}
          </button>
        </>
      )}
    </div>
  );
}
