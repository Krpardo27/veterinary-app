"use server";

import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/generated/prisma/enums";
import { requireAdminAction } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

const DELETABLE_RESERVATION_STATUSES: ReservationStatus[] = [
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
];

export async function deleteReservationAction(reservationId: string) {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { error: auth.error };
  }

  try {
    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId },
      select: { status: true },
    });

    if (!reservation) {
      return {
        error: "Reserva no encontrada.",
      };
    }

    if (!DELETABLE_RESERVATION_STATUSES.includes(reservation.status)) {
      return {
        error: "Solo se pueden eliminar reservas del historial.",
      };
    }

    const deletedReservation = await prisma.reservation.deleteMany({
      where: { id: reservationId },
    });

    if (deletedReservation.count === 0) {
      return {
        error: "Reserva no encontrada.",
      };
    }

    revalidatePath("/admin/historial");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      error: "No fue posible eliminar la reserva.",
    };
  }
}