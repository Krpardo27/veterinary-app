import type { Professional, Service } from "../../src/generated/prisma/client";

export const GROOMING_SERVICE_SLUGS = ["bano-completo", "corte-pelo"];

export function buildProfessionalServices(
  professionals: Professional[],
  services: Service[],
) {
  const pairs: Array<{ professionalId: string; serviceId: string }> = [];

  for (const professional of professionals) {
    const eligibleServices = services.filter((service) => {
      const isGroomingService = GROOMING_SERVICE_SLUGS.includes(service.slug);

      return professional.role === "GROOMING"
        ? isGroomingService
        : !isGroomingService;
    });

    for (const service of eligibleServices) {
      pairs.push({ professionalId: professional.id, serviceId: service.id });
    }
  }

  return pairs;
}
