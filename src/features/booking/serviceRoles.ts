export const GROOMING_SERVICE_SLUGS = ["bano-completo", "corte-pelo"] as const;
export const GROOMING_CATEGORY_SLUGS = ["peluqueria", "peluqueria-y-bano", "bano", "banos", "estetica", "grooming"] as const;
const GROOMING_CATEGORY_KEYWORDS = ["peluqueria", "bano", "banos", "estetica", "grooming"] as const;

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
  ) || GROOMING_CATEGORY_KEYWORDS.some((keyword) => categorySlug?.includes(keyword));

  return isGroomingService || isGroomingCategory
    ? "GROOMING"
    : "VETERINARY";
}
