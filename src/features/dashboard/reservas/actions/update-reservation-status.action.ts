"use server";

import { revalidatePath } from "next/cache";
import { ReservationStatus } from "@/generated/prisma/enums";
import { requireAdminAction } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

const ALLOWED_TARGET_STATUSES: ReservationStatus[] = ["COMPLETED", "NO_SHOW"];

export async function updateReservationStatusAction(
  reservationId: string,
  targetStatus: ReservationStatus,
) {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { error: auth.error };
  }

  try {
    if (!ALLOWED_TARGET_STATUSES.includes(targetStatus)) {
      return { error: "Estado de destino no permitido" };
    }

    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId },
      select: { status: true },
    });

    if (!reservation) {
      return { error: "Reserva no encontrada" };
    }

    if (reservation.status !== "PENDING" && reservation.status !== "CONFIRMED") {
      return { error: "Solo reservas pendientes o confirmadas pueden cambiar de estado" };
    }

    const updatedReservation = await prisma.reservation.updateMany({
      where: { id: reservationId },
      data: {
        status: targetStatus,
        completedAt: targetStatus === "COMPLETED" ? new Date() : null,
      },
    });

    if (updatedReservation.count === 0) {
      return { error: "Reserva no encontrada" };
    }

    revalidatePath("/admin/agenda");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin/historial");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin");
    revalidatePath("/reservar");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "No fue posible actualizar el estado de la reserva" };
  }
}