"use server";

import { z } from "zod";

import { requireAdminAction } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { VaccinationRecordSchema } from "../schemas/pet-health.schema";
import {
  dateFromInput,
  getPetForUpdate,
  revalidatePet,
  type PetHealthActionState,
} from "./pet-health.shared";

function parseVaccinationRecord(formData: FormData) {
  return VaccinationRecordSchema.safeParse({
    vaccineName: formData.get("vaccineName"),
    appliedAt: formData.get("appliedAt"),
    nextDueAt: formData.get("nextDueAt") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

function vaccinationData(data: ReturnType<typeof VaccinationRecordSchema.parse>) {
  return {
    vaccineName: data.vaccineName,
    appliedAt: dateFromInput(data.appliedAt),
    nextDueAt: data.nextDueAt ? dateFromInput(data.nextDueAt) : null,
    notes: data.notes || null,
  };
}

export async function createVaccinationRecordAction(
  petId: string,
  _previousState: PetHealthActionState,
  formData: FormData,
): Promise<PetHealthActionState> {
  const auth = await requireAdminAction();
  if (auth.error) return { status: "error", message: auth.error };

  const parsed = parseVaccinationRecord(formData);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos de la vacuna", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const pet = await getPetForUpdate(petId);
  if (!pet) return { status: "error", message: "Mascota no encontrada" };

  try {
    await prisma.vaccinationRecord.create({ data: { petId: pet.id, ...vaccinationData(parsed.data) } });
    revalidatePet(pet.customerId, pet.id);
    return { status: "success", message: "Vacuna registrada correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible registrar la vacuna" };
  }
}

export async function updateVaccinationRecordAction(
  petId: string,
  recordId: string,
  _previousState: PetHealthActionState,
  formData: FormData,
): Promise<PetHealthActionState> {
  const auth = await requireAdminAction();
  if (auth.error) return { status: "error", message: auth.error };

  const parsed = parseVaccinationRecord(formData);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos de la vacuna", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const [pet, record] = await Promise.all([
    getPetForUpdate(petId),
    prisma.vaccinationRecord.findFirst({ where: { id: recordId, petId }, select: { id: true } }),
  ]);
  if (!pet || !record) return { status: "error", message: "Vacuna no encontrada" };

  try {
    await prisma.vaccinationRecord.update({ where: { id: record.id }, data: vaccinationData(parsed.data) });
    revalidatePet(pet.customerId, pet.id);
    return { status: "success", message: "Vacuna actualizada correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible actualizar la vacuna" };
  }
}

export async function deleteVaccinationRecordAction(petId: string, recordId: string): Promise<PetHealthActionState> {
  const auth = await requireAdminAction();
  if (auth.error) return { status: "error", message: auth.error };

  const [pet, record] = await Promise.all([
    getPetForUpdate(petId),
    prisma.vaccinationRecord.findFirst({ where: { id: recordId, petId }, select: { id: true } }),
  ]);
  if (!pet || !record) return { status: "error", message: "Vacuna no encontrada" };

  try {
    await prisma.vaccinationRecord.delete({ where: { id: record.id } });
    revalidatePet(pet.customerId, pet.id);
    return { status: "success", message: "Vacuna eliminada" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible eliminar la vacuna" };
  }
}