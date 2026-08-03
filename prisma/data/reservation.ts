import {
  ReservationStatus,
  type Customer,
  type Service,
  type Veterinarian,
} from "../../src/generated/prisma/client";

export function buildReservations(
  customers: Customer[],
  veterinarians: Veterinarian[],
  services: Service[],
) {
  return customers
    .filter((_, i) => i % 3 !== 0)
    .map((customer) => {
      const service = services[Math.floor(Math.random() * services.length)];
      const veterinarian =
        veterinarians[Math.floor(Math.random() * veterinarians.length)];

      const start = new Date();
      start.setDate(start.getDate() + Math.floor(Math.random() * 20));
      start.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + service.durationMin);

      return {
        customerId: customer.id,
        veterinarianId: veterinarian.id,
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
