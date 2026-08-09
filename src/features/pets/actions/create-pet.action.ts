"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth-server";
import { PetSchema, type PetFieldErrors, type PetInput } from "../schemas/pet.schema";

export type CreatePetState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: PetFieldErrors;
  unchanged?: boolean;
};

function parsePetForm(formData: FormData) {
  return PetSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    breed: formData.get("breed") ?? "",
    sex: formData.get("sex"),
    birthDate: formData.get("birthDate") ?? "",
    color: formData.get("color") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

function petData(data: PetInput) {
  return {
    name: data.name,
    species: data.species,
    breed: data.breed || null,
    sex: data.sex,
    birthDate: data.birthDate ? new Date(`${data.birthDate}T12:00:00`) : null,
    color: data.color || null,
    notes: data.notes || null,
  };
}

export async function createPetAction(
  customerId: string,
  _previousState: CreatePetState,
  formData: FormData,
): Promise<CreatePetState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const parsed = parsePetForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los datos de la mascota",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { id: true },
  });

  if (!customer) {
    return { status: "error", message: "Cliente no encontrado" };
  }

  try {
    await prisma.pet.create({
      data: {
        customerId: customer.id,
        ...petData(parsed.data),
      },
    });

    revalidatePath("/admin/clientes");
    revalidatePath("/admin");

    return { status: "success", message: "Mascota creada correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible crear la mascota" };
  }
}

export async function updatePetAction(
  petId: string,
  _previousState: CreatePetState,
  formData: FormData,
): Promise<CreatePetState> {
  const auth = await requireAdminAction();

  if (auth.error) return { status: "error", message: auth.error };

  const parsed = parsePetForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los datos de la mascota",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: {
      id: true,
      customerId: true,
      name: true,
      species: true,
      breed: true,
      sex: true,
      birthDate: true,
      color: true,
      notes: true,
    },
  });

  if (!pet) return { status: "error", message: "Mascota no encontrada" };

  const existingBirthDate = pet.birthDate
    ? pet.birthDate.toISOString().slice(0, 10)
    : "";
  const hasChanges =
    pet.name !== parsed.data.name ||
    pet.species !== parsed.data.species ||
    (pet.breed ?? "") !== parsed.data.breed ||
    pet.sex !== parsed.data.sex ||
    existingBirthDate !== parsed.data.birthDate ||
    (pet.color ?? "") !== parsed.data.color ||
    (pet.notes ?? "") !== parsed.data.notes;

  if (!hasChanges) {
    return {
      status: "success",
      message: "No se detectaron cambios",
      unchanged: true,
    };
  }

  try {
    await prisma.pet.update({
      where: { id: pet.id },
      data: petData(parsed.data),
    });

    revalidatePath("/admin/clientes");
    revalidatePath(`/admin/clientes/${pet.customerId}`);
    revalidatePath(`/admin/clientes/${pet.customerId}/mascotas/${pet.id}`);

    return { status: "success", message: "Perfil de mascota actualizado" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible actualizar la mascota" };
  }
}
