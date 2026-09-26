import { z } from "zod";

const dateInput = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida");

function dateAtNoon(value: string) {
  return new Date(`${value}T12:00:00`);
}

function isNotFutureDate(value: string) {
  return dateAtNoon(value).getTime() <= Date.now();
}

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
  measuredAt: dateInput.refine(isNotFutureDate, "La fecha no puede ser futura"),
  notes: optionalNotes,
});

export const VaccinationRecordSchema = z
  .object({
    vaccineName: z
      .string()
      .trim()
      .min(2, "Ingresa el nombre de la vacuna")
      .max(100, "El nombre no puede superar los 100 caracteres"),
    appliedAt: dateInput.refine(isNotFutureDate, "La fecha de aplicación no puede ser futura"),
    nextDueAt: dateInput.or(z.literal("")),
    notes: optionalNotes,
  })
  .refine(
    (data) => !data.nextDueAt || dateAtNoon(data.nextDueAt) >= dateAtNoon(data.appliedAt),
    { path: ["nextDueAt"], message: "La próxima dosis no puede ser anterior a la aplicación" },
  );

export type WeightRecordInput = z.infer<typeof WeightRecordSchema>;
export type VaccinationRecordInput = z.infer<typeof VaccinationRecordSchema>;
