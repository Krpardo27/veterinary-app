"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth-server";
import {
  normalizeServiceSlug,
  ServiceSchema,
  type ServiceFieldErrors,
  validateServiceSlug,
} from "../schemas/service.schema";

export type ServiceActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: ServiceFieldErrors;
};

function serviceFormDataFrom(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug") ?? "",
    description: formData.get("description"),
    price: formData.get("price"),
    durationMin: formData.get("durationMin"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    isActive: formData.get("isActive") === "on",
  };
}

function revalidateServices() {
  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
}

export async function deleteServiceAction(
  serviceId: string,
): Promise<ServiceActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId },
    select: {
      id: true,
      category: { select: { slug: true } },
      _count: { select: { reservations: true } },
    },
  });

  if (!service) {
    return { status: "error", message: "Servicio no encontrado" };
  }

  if (service._count.reservations > 0) {
    return {
      status: "error",
      message:
        "No se puede eliminar un servicio con reservas asociadas. Puedes dejarlo inactivo.",
    };
  }

  try {
    await prisma.service.delete({ where: { id: serviceId } });

    revalidateServices();
    revalidatePath(`/servicios/${service.category.slug}`);

    return { status: "success", message: "Servicio eliminado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible eliminar el servicio" };
  }
}

export async function deactivateServiceAction(
  serviceId: string,
): Promise<ServiceActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId },
    select: { id: true, category: { select: { slug: true } } },
  });

  if (!service) {
    return { status: "error", message: "Servicio no encontrado" };
  }

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });

    revalidateServices();
    revalidatePath(`/servicios/${service.category.slug}`);

    return { status: "success", message: "Servicio desactivado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible desactivar el servicio" };
  }
}

export async function createServiceAction(
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const serviceData = serviceFormDataFrom(formData);

  if (!serviceData.categoryId) {
    const defaultCategory = await prisma.category.findFirst({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true },
    });

    if (!defaultCategory) {
      return {
        status: "error",
        message: "No hay categorías disponibles. Crea una categoría primero.",
      };
    }

    serviceData.categoryId = defaultCategory.id;
  }

  const parsed = ServiceSchema.safeParse(serviceData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del servicio",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const slug = normalizeServiceSlug(parsed.data.slug || parsed.data.name);

  if (!validateServiceSlug(slug)) {
    return {
      status: "error",
      message: "No fue posible generar una URL válida para el servicio",
      fieldErrors: { name: ["Usa un nombre con letras o números"] },
    };
  }

  const category = await prisma.category.findFirst({
    where: { id: parsed.data.categoryId, isActive: true },
    select: { id: true, slug: true },
  });

  if (!category) {
    return {
      status: "error",
      message: "La categoría seleccionada no existe o no está activa",
      fieldErrors: { categoryId: ["Selecciona una categoría válida"] },
    };
  }

  const existingSlug = await prisma.service.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingSlug) {
    return {
      status: "error",
      message: "Ya existe un servicio con ese nombre",
      fieldErrors: { name: ["Elige otro nombre para generar una URL única"] },
    };
  }

  try {
    await prisma.service.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: parsed.data.price,
        durationMin: parsed.data.durationMin,
        imageUrl: null,
        featured: parsed.data.featured,
        isActive: parsed.data.isActive,
        categoryId: parsed.data.categoryId,
      },
    });

    revalidateServices();
    revalidatePath(`/servicios/${category.slug}`);

    return { status: "success", message: "Servicio creado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible crear el servicio" };
  }
}

export async function updateServiceAction(
  serviceId: string,
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const parsed = ServiceSchema.safeParse(serviceFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del servicio",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const currentService = await prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      slug: true,
      categoryId: true,
      category: { select: { slug: true } },
    },
  });

  if (!currentService) {
    return { status: "error", message: "Servicio no encontrado" };
  }

  const slug = parsed.data.slug
    ? normalizeServiceSlug(parsed.data.slug)
    : currentService.slug;

  if (!validateServiceSlug(slug)) {
    return {
      status: "error",
      message: "No fue posible generar una URL válida para el servicio",
      fieldErrors: { slug: ["Usa letras y números para la URL"] },
    };
  }

  const category = await prisma.category.findFirst({
    where: { id: parsed.data.categoryId },
    select: { id: true, slug: true, isActive: true },
  });

  if (!category) {
    return {
      status: "error",
      message: "La categoría seleccionada no existe",
      fieldErrors: { categoryId: ["Selecciona una categoría válida"] },
    };
  }

  if (!category.isActive && category.id !== currentService.categoryId) {
    return {
      status: "error",
      message: "La categoría seleccionada no está activa",
      fieldErrors: { categoryId: ["Selecciona una categoría activa"] },
    };
  }

  const existingSlug = await prisma.service.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingSlug && existingSlug.id !== serviceId) {
    return {
      status: "error",
      message: "Ya existe un servicio con ese nombre",
      fieldErrors: { name: ["Elige otro nombre para generar una URL única"] },
    };
  }

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: parsed.data.price,
        durationMin: parsed.data.durationMin,
        featured: parsed.data.featured,
        isActive: parsed.data.isActive,
        categoryId: parsed.data.categoryId,
      },
    });

    revalidateServices();
    revalidatePath(`/servicios/${currentService.category.slug}`);
    revalidatePath(`/servicios/${category.slug}`);

    return { status: "success", message: "Servicio actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "No fue posible actualizar el servicio",
    };
  }
}
