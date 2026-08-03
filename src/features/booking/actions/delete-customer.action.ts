"use server";

import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/generated/prisma/enums";
import { requireAdminAction } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED"];

export async function deleteCustomerAction(customerId: string) {
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
      return {
        error: "No se puede eliminar un cliente con citas activas.",
      };
    }

    const customer = await prisma.customer.findFirst({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      return {
        error: "Cliente no encontrado.",
      };
    }

    const deletedCustomer = await prisma.customer.deleteMany({
      where: { id: customerId },
    });

    if (deletedCustomer.count === 0) {
      return {
        error: "Cliente no encontrado.",
      };
    }

    revalidatePath("/admin/clientes");
    revalidatePath("/admin/historial");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      error: "No fue posible eliminar el cliente.",
    };
  }
}