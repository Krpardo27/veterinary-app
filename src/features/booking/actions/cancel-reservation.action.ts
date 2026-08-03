"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function cancelReservationAction(
  reservationId: string
) {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { error: auth.error };
  }

  try {
    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId },
    });

    if (!reservation) {
      return {
        error: "Reserva no encontrada",
      };
    }

    if (reservation.status === "CANCELLED") {
      return {
        error: "La reserva ya está cancelada",
      };
    }

    const updatedReservation = await prisma.reservation.updateMany({
      where: { id: reservationId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    if (updatedReservation.count === 0) {
      return {
        error: "Reserva no encontrada",
      };
    }

    revalidatePath("/admin/agenda");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin/historial");
    revalidatePath("/admin");
    revalidatePath("/reservar");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "No fue posible cancelar la reserva",
    };
  }
}