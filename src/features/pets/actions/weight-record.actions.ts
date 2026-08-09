"use server";

import { z } from "zod";

import { requireAdminAction } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { WeightRecordSchema } from "../schemas/pet-health.schema";
import {
  dateFromInput,
  getPetForUpdate,
  revalidatePet,
  type PetHealthActionState,
} from "./pet-health.shared";

async function syncCurrentWeight(petId: string) {
  const latestRecord = await prisma.weightRecord.findFirst({
    where: { petId },
    orderBy: [{ measuredAt: "desc" }, { createdAt: "desc" }],
    select: { weight: true },
  });

  await prisma.pet.update({
    where: { id: petId },
    data: { weight: latestRecord?.weight ?? null },
  });
}

function parseWeightRecord(formData: FormData) {
  return WeightRecordSchema.safeParse({
    weight: formData.get("weight"),
    measuredAt: formData.get("measuredAt"),
    notes: formData.get("notes") ?? "",
  });
}

export async function createWeightRecordAction(
  petId: string,
  _previousState: PetHealthActionState,
  formData: FormData,
): Promise<PetHealthActionState> {
  const auth = await requireAdminAction();
  if (auth.error) return { status: "error", message: auth.error };

  const parsed = parseWeightRecord(formData);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del peso", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const pet = await getPetForUpdate(petId);
  if (!pet) return { status: "error", message: "Mascota no encontrada" };

  try {
    await prisma.$transaction([
      prisma.weightRecord.create({
        data: { petId: pet.id, weight: parsed.data.weight, measuredAt: dateFromInput(parsed.data.measuredAt), notes: parsed.data.notes || null },
      }),
      prisma.pet.update({ where: { id: pet.id }, data: { weight: parsed.data.weight } }),
    ]);
    revalidatePet(pet.customerId, pet.id);
    return { status: "success", message: "Peso registrado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible registrar el peso" };
  }
}

export async function updateWeightRecordAction(
  petId: string,
  recordId: string,
  _previousState: PetHealthActionState,
  formData: FormData,
): Promise<PetHealthActionState> {
  const auth = await requireAdminAction();
  if (auth.error) return { status: "error", message: auth.error };

  const parsed = parseWeightRecord(formData);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del peso", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const [pet, record] = await Promise.all([
    getPetForUpdate(petId),
    prisma.weightRecord.findFirst({ where: { id: recordId, petId }, select: { id: true } }),
  ]);
  if (!pet || !record) return { status: "error", message: "Control de peso no encontrado" };

  try {
    await prisma.weightRecord.update({
      where: { id: record.id },
      data: { weight: parsed.data.weight, measuredAt: dateFromInput(parsed.data.measuredAt), notes: parsed.data.notes || null },
    });
    await syncCurrentWeight(pet.id);
    revalidatePet(pet.customerId, pet.id);
    return { status: "success", message: "Peso actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible actualizar el peso" };
  }
}

export async function deleteWeightRecordAction(petId: string, recordId: string): Promise<PetHealthActionState> {
  const auth = await requireAdminAction();
  if (auth.error) return { status: "error", message: auth.error };

  const [pet, record] = await Promise.all([
    getPetForUpdate(petId),
    prisma.weightRecord.findFirst({ where: { id: recordId, petId }, select: { id: true } }),
  ]);
  if (!pet || !record) return { status: "error", message: "Control de peso no encontrado" };

  try {
    await prisma.weightRecord.delete({ where: { id: record.id } });
    await syncCurrentWeight(pet.id);
    revalidatePet(pet.customerId, pet.id);
    return { status: "success", message: "Control de peso eliminado" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible eliminar el peso" };
  }
}