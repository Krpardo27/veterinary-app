"use server";

import { revalidatePath } from "next/cache";
import { ReservationStatus } from "@/generated/prisma/enums";
import { requireAdminAction } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED"];

export async function archiveCustomerAction(customerId: string) {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { error: auth.error };
  }

  try {
    const activeReservations = await prisma.reservation.count({
      where: {
        customerId,
        status: { in: ACTIVE_RESERVATION_STATUSES },
      },
    });

    if (activeReservations > 0) {
      return { error: "No se puede dar de baja un cliente con citas activas." };
    }

    const archivedCustomer = await prisma.customer.updateMany({
      where: { id: customerId, isActive: true },
      data: { isActive: false },
    });

    if (archivedCustomer.count === 0) {
      return { error: "Cliente no encontrado o ya dado de baja." };
    }

    revalidatePath("/admin/clientes");
    revalidatePath(`/admin/clientes/${customerId}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "No fue posible dar de baja el cliente." };
  }
}