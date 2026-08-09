export const GROOMING_SERVICE_SLUGS = ["bano-completo", "corte-pelo"] as const;

export type ProfessionalRole = "VETERINARY" | "GROOMING";

export function getRequiredProfessionalRole(
  serviceSlug: string,
): ProfessionalRole {
  return GROOMING_SERVICE_SLUGS.includes(
    serviceSlug as (typeof GROOMING_SERVICE_SLUGS)[number],
  )
    ? "GROOMING"
    : "VETERINARY";
}
