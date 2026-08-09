import { z } from "zod";

const dateInput = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida");

const optionalNotes = z
  .string()
  .trim()
  .max(500, "Las notas no pueden superar los 500 caracteres")
  .transform((value) => value || "");

export const WeightRecordSchema = z.object({
  weight: z.coerce
    .number({ message: "Ingresa un peso válido" })
    .positive("El peso debe ser mayor a cero")
    .max(200, "El peso no puede superar los 200 kg"),
  measuredAt: dateInput,
  notes: optionalNotes,
});

export const VaccinationRecordSchema = z.object({
  vaccineName: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre de la vacuna")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  appliedAt: dateInput,
  nextDueAt: dateInput.or(z.literal("")),
  notes: optionalNotes,
});

export type WeightRecordInput = z.infer<typeof WeightRecordSchema>;
export type VaccinationRecordInput = z.infer<typeof VaccinationRecordSchema>;
