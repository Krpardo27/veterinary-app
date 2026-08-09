"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function cancelReservationAction(reservationId: string) {
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
      return { error: "Reserva no encontrada" };
    }

    if (reservation.status !== "PENDING" && reservation.status !== "CONFIRMED") {
      return { error: "Solo se pueden cancelar reservas pendientes o confirmadas" };
    }

    const updatedReservation = await prisma.reservation.updateMany({
      where: { id: reservationId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    if (updatedReservation.count === 0) {
      return { error: "Reserva no encontrada" };
    }

    revalidatePath("/admin/agenda");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin/historial");
    revalidatePath("/admin");
    revalidatePath("/reservar");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "No fue posible cancelar la reserva" };
  }
}