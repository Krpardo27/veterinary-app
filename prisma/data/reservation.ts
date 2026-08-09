import {
  ReservationStatus,
  type Customer,
  type Service,
  type Professional,
} from "../../src/generated/prisma/client";
import { GROOMING_SERVICE_SLUGS } from "./veterinarian-services";

export function buildReservations(
  customers: Customer[],
  professionals: Professional[],
  services: Service[],
) {
  return customers
    .filter((_, i) => i % 3 !== 0)
    .map((customer) => {
      const service = services[Math.floor(Math.random() * services.length)];
      const isGroomingService = GROOMING_SERVICE_SLUGS.includes(service.slug);
      const eligibleProfessionals = professionals.filter((professional) =>
        isGroomingService
          ? professional.role === "GROOMING"
          : professional.role === "VETERINARY",
      );
      const professional =
        eligibleProfessionals[
          Math.floor(Math.random() * eligibleProfessionals.length)
        ];

      const start = new Date();
      start.setDate(start.getDate() + Math.floor(Math.random() * 20));
      start.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + service.durationMin);

      return {
        customerId: customer.id,
        professionalId: professional.id,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        durationMin: service.durationMin,
        startAt: start,
        endAt: end,
        status: ReservationStatus.CONFIRMED,
      };
    });
}
