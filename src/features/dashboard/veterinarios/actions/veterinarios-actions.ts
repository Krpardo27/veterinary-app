"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth-server";
import { VetSchema, type VetFieldErrors } from "../schemas/vet.schema";

export type VetActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: VetFieldErrors;
  values?: VetFormValues;
};

export type VetFormValues = {
  name: string;
  phone: string;
  email: string;
  bio: string;
  imageUrl: string;
  isActive: boolean;
  services: Record<string, { isActive: boolean; durationMin: string }>;
};

function vetFormDataFrom(formData: FormData) {
  return {
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    bio: formData.get("bio") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    isActive: formData.get("isActive") === "on",
  };
}

function vetValuesFrom(formData: FormData): VetFormValues {
  const serviceValues: VetFormValues["services"] = {};

  for (const [key, value] of formData.entries()) {
    const durationPrefix = "serviceDuration:";
    const enabledPrefix = "serviceEnabled:";

    if (key.startsWith(durationPrefix)) {
      const serviceId = key.slice(durationPrefix.length);
      serviceValues[serviceId] = {
        isActive: false,
        durationMin: value.toString(),
      };
    }

    if (key.startsWith(enabledPrefix)) {
      const serviceId = key.slice(enabledPrefix.length);
      serviceValues[serviceId] = {
        durationMin: serviceValues[serviceId]?.durationMin ?? "",
        isActive: true,
      };
    }
  }

  return {
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    bio: formData.get("bio")?.toString() ?? "",
    imageUrl: formData.get("imageUrl")?.toString() ?? "",
    isActive: formData.get("isActive") === "on",
    services: serviceValues,
  };
}

type VetServiceConfig = {
  serviceId: string;
  durationMin: number | null;
  isActive: boolean;
};

function parseVetServiceConfigs(
  formData: FormData,
  services: Array<{ id: string }>,
): { configs: VetServiceConfig[]; error: string | null } {
  const configs: VetServiceConfig[] = [];

  for (const service of services) {
    const rawDuration = formData.get(`serviceDuration:${service.id}`)?.toString().trim() ?? "";
    const isActive = formData.get(`serviceEnabled:${service.id}`) === "on";
    let durationMin: number | null = null;

    if (rawDuration) {
      const parsedDuration = Number(rawDuration);

      if (!Number.isInteger(parsedDuration) || parsedDuration < 5 || parsedDuration > 480) {
        return {
          configs: [],
          error: "Las duraciónes por servicio deben ser numeros entre 5 y 480 minutos",
        };
      }

      durationMin = parsedDuration;
    }

    configs.push({ serviceId: service.id, durationMin, isActive });
  }

  return { configs, error: null };
}

async function getServiceConfigsFromForm(formData: FormData) {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { id: true },
    orderBy: { name: "asc" },
  });

  return parseVetServiceConfigs(formData, services);
}

function revalidateVets() {
  revalidatePath("/admin/veterinarios");
  revalidatePath("/admin");
}

export async function createVetAction(
  _previousState: VetActionState,
  formData: FormData,
): Promise<VetActionState> {
  const auth = await requireAdminAction();
  const values = vetValuesFrom(formData);

  if (auth.error) {
    return { status: "error", message: auth.error, values };
  }

  const parsed = VetSchema.safeParse(vetFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del veterinario",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const serviceConfigs = await getServiceConfigsFromForm(formData);

  if (serviceConfigs.error) {
    return { status: "error", message: serviceConfigs.error, values };
  }

  try {
    await prisma.veterinarian.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        bio: parsed.data.bio || null,
        imageUrl: parsed.data.imageUrl || null,
        isActive: parsed.data.isActive,
        services: {
          create: serviceConfigs.configs.map((config) => ({
            serviceId: config.serviceId,
            durationMin: config.durationMin,
            isActive: config.isActive,
          })),
        },
      },
    });

    revalidateVets();

    return { status: "success", message: "Veterinario creado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible crear el veterinario", values };
  }
}

export async function updateVetAction(
  vetId: string,
  _previousState: VetActionState,
  formData: FormData,
): Promise<VetActionState> {
  const auth = await requireAdminAction();
  const values = vetValuesFrom(formData);

  if (auth.error) {
    return { status: "error", message: auth.error, values };
  }

  const parsed = VetSchema.safeParse(vetFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del veterinario",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const serviceConfigs = await getServiceConfigsFromForm(formData);

  if (serviceConfigs.error) {
    return { status: "error", message: serviceConfigs.error, values };
  }

  const vet = await prisma.veterinarian.findUnique({
    where: { id: vetId },
    select: { id: true },
  });

  if (!vet) {
    return { status: "error", message: "Veterinario no encontrado", values };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.veterinarian.update({
        where: { id: vetId },
        data: {
          name: parsed.data.name,
          phone: parsed.data.phone || null,
          email: parsed.data.email || null,
          bio: parsed.data.bio || null,
          imageUrl: parsed.data.imageUrl || null,
          isActive: parsed.data.isActive,
        },
      });

      await tx.veterinarianService.deleteMany({ where: { veterinarianId: vetId } });

      if (serviceConfigs.configs.length > 0) {
        await tx.veterinarianService.createMany({
          data: serviceConfigs.configs.map((config) => ({
            ...config,
            veterinarianId: vetId,
          })),
        });
      }
    });

    revalidateVets();

    return { status: "success", message: "Veterinario actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible actualizar el veterinario", values };
  }
}

export async function deleteVetAction(vetId: string): Promise<VetActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const vet = await prisma.veterinarian.findUnique({
    where: { id: vetId },
    select: { id: true, _count: { select: { reservations: true } } },
  });

  if (!vet) {
    return { status: "error", message: "Veterinario no encontrado" };
  }

  if (vet._count.reservations > 0) {
    return {
      status: "error",
      message: "No se puede eliminar un veterinario con reservas asociadas. Puedes desactivarlo.",
    };
  }

  try {
    await prisma.veterinarian.delete({ where: { id: vetId } });

    revalidateVets();

    return { status: "success", message: "Veterinario eliminado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible eliminar el veterinario" };
  }
}