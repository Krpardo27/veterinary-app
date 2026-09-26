"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { normalizeServiceSlug, validateServiceSlug } from "../schemas/service.schema";

const CategorySchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(80, "El nombre no puede superar 80 caracteres"),
  slug: z.string().trim().max(90, "La URL no puede superar 90 caracteres").optional().or(z.literal("")),
  description: z.string().trim().max(240, "La descripción no puede superar 240 caracteres").optional().or(z.literal("")),
});

export type CategoryActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "slug" | "description", string[]>>;
};

const initialFieldErrors = (error: z.ZodError<z.infer<typeof CategorySchema>>) =>
  z.flattenError(error).fieldErrors;

function categoryFormDataFrom(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug") ?? "",
    description: formData.get("description") ?? "",
  };
}

function revalidateCategories() {
  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
}

export async function createCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const parsed = CategorySchema.safeParse(categoryFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos de la categoría",
      fieldErrors: initialFieldErrors(parsed.error),
    };
  }

  const slug = normalizeServiceSlug(parsed.data.slug || parsed.data.name);

  if (!validateServiceSlug(slug)) {
    return {
      status: "error",
      message: "No fue posible generar una URL válida para la categoría",
      fieldErrors: { name: ["Usa un nombre con letras o números"] },
    };
  }

  const existingCategory = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingCategory) {
    return {
      status: "error",
      message: "Ya existe una categoría con ese nombre",
      fieldErrors: { name: ["Elige otro nombre para generar una URL única"] },
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
      },
    });

    revalidateCategories();

    return { status: "success", message: "Categoría creada correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible crear la categoría" };
  }
}