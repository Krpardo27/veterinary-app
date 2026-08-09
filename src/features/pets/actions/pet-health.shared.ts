import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type PetHealthActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function getPetForUpdate(petId: string) {
  return prisma.pet.findUnique({
    where: { id: petId },
    select: { id: true, customerId: true },
  });
}

export function revalidatePet(customerId: string, petId: string) {
  revalidatePath(`/admin/clientes/${customerId}`);
  revalidatePath(`/admin/clientes/${customerId}/mascotas/${petId}`);
}

export function dateFromInput(value: string) {
  return new Date(`${value}T12:00:00`);
}