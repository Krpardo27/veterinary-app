import type { Service, Veterinarian } from "../../src/generated/prisma/client";

export function buildVeterinarianServices(
  veterinarians: Veterinarian[],
  services: Service[],
) {
  const pairs: Array<{ veterinarianId: string; serviceId: string }> = [];

  for (const vet of veterinarians) {
    for (const service of services) {
      pairs.push({ veterinarianId: vet.id, serviceId: service.id });
    }
  }

  return pairs;
}
