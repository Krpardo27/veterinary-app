export const MIXED_BREED = "Mestizo / Quiltro";

export const DOG_BREEDS = [
  MIXED_BREED,
  "Beagle",
  "Bóxer",
  "Bulldog francés",
  "Chihuahua",
  "Cocker spaniel",
  "Golden retriever",
  "Labrador retriever",
  "Pastor alemán",
  "Poodle",
  "Pug",
  "Rottweiler",
  "Schnauzer",
  "Siberiano",
  "Yorkshire terrier",
  "Otra raza",
];

export const CAT_BREEDS = [
  MIXED_BREED,
  "Angora",
  "Bengalí",
  "British shorthair",
  "Maine coon",
  "Persa",
  "Ragdoll",
  "Siamés",
  "Siberiano",
  "Sphynx",
  "Otra raza",
];

export function getBreedsForSpecies(species: string) {
  if (species === "CAT") return CAT_BREEDS;
  if (species === "DOG") return DOG_BREEDS;
  return [MIXED_BREED, "Otra raza"];
}
