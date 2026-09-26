export const GROOMING_SERVICE_SLUGS = ["bano-completo", "corte-pelo"] as const;
export const GROOMING_CATEGORY_SLUGS = ["peluqueria"] as const;

export type ProfessionalRole = "VETERINARY" | "GROOMING";

export function getRequiredProfessionalRole(
  serviceSlug: string,
  categorySlug?: string | null,
): ProfessionalRole {
  const isGroomingService = GROOMING_SERVICE_SLUGS.includes(
    serviceSlug as (typeof GROOMING_SERVICE_SLUGS)[number],
  );
  const isGroomingCategory = GROOMING_CATEGORY_SLUGS.includes(
    categorySlug as (typeof GROOMING_CATEGORY_SLUGS)[number],
  );

  return isGroomingService || isGroomingCategory
    ? "GROOMING"
    : "VETERINARY";
}
