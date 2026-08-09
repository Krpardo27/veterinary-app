"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReservationSchema } from "../schemas/reservation.schema";
import {
  findAvailableProfessional,
  getActiveService,
  getDayRange,
  getDurationForProfessional,
  hasReservationConflict,
  isInsideBusinessWindow,
  isValidReservationStart,
  resolveBusinessHours,
} from "../services/availability";
import { getBusinessDateInput, parseBusinessDateTimeInput } from "@/shared/utils/businessTime";
import { requireAdminAction } from "@/lib/auth-server";

type CreateReservationActionResult =
  | { errors: Array<{ message: string }>; data?: never; success?: false }
  | { success: true; data: { reservationId: string }; errors?: never };

type ReservationTransactionResult =
  | { errors: Array<{ message: string }>; reservationId?: never }
  | { reservationId: string; errors?: never };

export async function createReservationAction(
  data: unknown,
): Promise<CreateReservationActionResult> {
  const result = ReservationSchema.safeParse(data);
  
  if (!result.success) {
    return { errors: result.error.issues };
  }
  const {
    serviceId,
    professionalId,
    customerId,
    customerName,
    customerPhone,
    customerEmail,
    petName,
    petSpecies,
    petBreed,
    startAt,
    notes,
  } = result.data;
  const auth = await requireAdminAction();
  if (auth.error) {
    return { errors: [{ message: auth.error }] };
  }

  const normalizedCustomerEmail = customerEmail || null;
  const businessHours = resolveBusinessHours();

  try {
    const reservation = await prisma.$transaction(async (tx): Promise<ReservationTransactionResult> => {
      const service = await getActiveService(tx, serviceId);

      if (!service) {
        return {
          errors: [{ message: "El servicio seleccionado no está disponible." }],
        };
      }

      const start = parseBusinessDateTimeInput(startAt!);

      if (!start || !isValidReservationStart(start, new Date(), businessHours)) {
        return {
          errors: [{ message: "Selecciona una fecha y hora válida." }],
        };
      }

      const dayRange = getDayRange(getBusinessDateInput(start));
      if (!dayRange || start < dayRange.dayStart || start > dayRange.dayEnd) {
        return {
          errors: [{ message: "Selecciona una fecha válida para reservar." }],
        };
      }

      const lockKey = `reservation:${getBusinessDateInput(start)}`;
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey})::bigint)`;

      let resolvedProfessionalId = professionalId || null;
      let resolvedDurationMin: number | null = null;

      if (resolvedProfessionalId) {
        resolvedDurationMin = await getDurationForProfessional(tx, service, resolvedProfessionalId);

        if (!resolvedDurationMin) {
          return {
            errors: [{ message: "El profesional seleccionado no atiende este servicio." }],
          };
        }
      } else {
        const availableProfessional = await findAvailableProfessional(tx, {
          service,
          start,
        });

        if (!availableProfessional) {
          return {
            errors: [{ message: "No hay profesionales disponibles para ese horario." }],
          };
        }

        resolvedProfessionalId = availableProfessional.professionalId;
        resolvedDurationMin = availableProfessional.durationMin;
      }

      const end = new Date(start.getTime() + resolvedDurationMin * 60 * 1000);

      if (!isInsideBusinessWindow({ start, end, businessHours })) {
        return {
          errors: [{ message: "Ese horario termina fuera del horario de atención." }],
        };
      }

      const conflict = await hasReservationConflict(tx, {
        professionalId: resolvedProfessionalId,
        start,
        end,
      });

      if (conflict) {
        return {
          errors: [{ message: "Ese horario ya está reservado, elige otro." }],
        };
      }

      let resolvedCustomerId = customerId;

      if (normalizedCustomerEmail) {
        const existingEmailCustomer = await tx.customer.findFirst({
          where: { email: normalizedCustomerEmail },
          select: { id: true, phone: true },
        });
        const isSameSelectedCustomer = existingEmailCustomer?.id === resolvedCustomerId;
        const isSamePhoneCustomer = existingEmailCustomer?.phone === customerPhone;

        if (existingEmailCustomer && !isSameSelectedCustomer && !isSamePhoneCustomer) {
          return {
            errors: [{ message: "Ese correo ya está registrado con otro cliente." }],
          };
        }
      }

      if (!resolvedCustomerId && customerPhone) {
        const customer = await tx.customer.upsert({
          where: {
            phone: customerPhone,
          },
          update: {
            name: customerName!,
            email: normalizedCustomerEmail,
          },
          create: {
            name: customerName!,
            phone: customerPhone,
            email: normalizedCustomerEmail,
          },
          select: { id: true },
        });

        resolvedCustomerId = customer.id;
      }

      if (!resolvedCustomerId) {
        return {
          errors: [{ message: "No se pudo identificar al cliente." }],
        };
      }

      const pet = await tx.pet.create({
        data: {
          customerId: resolvedCustomerId,
          name: petName,
          species: petSpecies,
          breed: petBreed || null,
        },
        select: { id: true },
      });

      const createdReservation = await tx.reservation.create({
        data: {
          customerId: resolvedCustomerId,
          serviceId: service.id,
          professionalId: resolvedProfessionalId,
          serviceName: service.name,
          servicePrice: service.price,
          durationMin: resolvedDurationMin,
          petId: pet.id,
          startAt: start,
          endAt: end,
          notes: notes || null,
        },
      });

      return { reservationId: createdReservation.id };
    });

    if (reservation.errors) {
      return reservation;
    }

    revalidatePath("/admin/agenda");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");
    revalidatePath("/reservar");
    return {
      success: true,
      data: {
        reservationId: reservation.reservationId,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      errors: [{ message: "Error al crear la reserva. Intenta de nuevo." }],
    };
  }
}
