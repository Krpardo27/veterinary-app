import { z } from "zod";

const chilePhoneRegex = /^\+569\d{8}$/;
const chilePhoneMessage = "Debe tener formato chileno +569XXXXXXXX";
const localDateTimeRegex =
  /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

export const ReservationSchema = z
  .object({
    serviceId: z.string().min(1, {
      message: "Selecciona un servicio",
    }),

    professionalId: z.string().optional(),

    customerMode: z.enum(["search", "new"]),
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    customerPhone: z
      .string()
      .trim()
      .refine((phone) => phone === "" || chilePhoneRegex.test(phone), {
        message: chilePhoneMessage,
      })
      .optional(),

    customerEmail: z
      .string()
      .trim()
      .toLowerCase()
      .refine((email) => email === "" || z.email().safeParse(email).success, {
        message: "Email inválido",
      })
      .optional(),

    petName: z
      .string()
      .trim()
      .min(1, { message: "El nombre de la mascota es obligatorio" })
      .max(80, { message: "El nombre no puede superar los 80 caracteres" }),
    petSpecies: z.enum(["DOG", "CAT"], {
      message: "Selecciona la especie de la mascota",
    }),
    petBreed: z
      .string()
      .trim()
      .max(80, { message: "La raza no puede superar los 80 caracteres" })
      .optional(),

    startAt: z
      .string()
      .trim()
      .refine((value) => value === "" || localDateTimeRegex.test(value), {
        message: "Formato de fecha y hora inválido",
      })
      .optional(),

    notes: z
      .string()
      .max(300, {
        message: "Máximo 300 caracteres",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceId.trim() && !data.startAt?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "Selecciona una fecha y hora",
      });
    }

    if (data.customerMode === "search" && !data.customerId) {
      ctx.addIssue({
        code: "custom",
        path: ["customerId"],
        message: "Busca un cliente registrado o crea uno nuevo",
      });
    }

    if (data.customerMode === "new" && !data.customerId) {
      if (!data.customerName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["customerName"],
          message: "El nombre es obligatorio",
        });
      }

      if (!data.customerPhone?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["customerPhone"],
          message: "El teléfono es obligatorio",
        });
      }
    }
  });

export type ReservationFormData = z.infer<typeof ReservationSchema>;
