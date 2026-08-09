import { z } from "zod";

export const PetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre de la mascota es obligatorio")
    .max(80, "El nombre no puede superar los 80 caracteres"),
  species: z.enum(["DOG", "CAT", "BIRD", "OTHER"], {
    message: "Selecciona la especie de la mascota",
  }),
  breed: z
    .string()
    .trim()
    .max(80, "La raza no puede superar los 80 caracteres")
    .transform((value) => value || ""),
  sex: z.enum(["MALE", "FEMALE", "UNKNOWN"], {
    message: "Selecciona el sexo de la mascota",
  }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$|^$/, "Selecciona una fecha válida"),
  color: z
    .string()
    .trim()
    .max(80, "El color no puede superar los 80 caracteres")
    .transform((value) => value || ""),
  notes: z
    .string()
    .trim()
    .max(500, "Las notas no pueden superar los 500 caracteres")
    .transform((value) => value || ""),
});

export type PetInput = z.infer<typeof PetSchema>;
export type PetFieldErrors = z.inferFlattenedErrors<typeof PetSchema>["fieldErrors"];
