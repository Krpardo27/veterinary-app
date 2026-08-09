import { FaCat, FaDog, FaPaw } from "react-icons/fa";
import Link from "next/link";
import type { PetSpecies } from "@/generated/prisma/enums";

type Props = {
  pet: {
    id: string;
    name: string;
    species: PetSpecies;
    breed: string | null;
    isActive: boolean;
  };
  href?: string;
};

export default function PetCard({ pet, href }: Props) {
  const Icon = pet.species === "DOG" ? FaDog : pet.species === "CAT" ? FaCat : FaPaw;
  const speciesLabel: Record<PetSpecies, string> = {
    DOG: "Perro",
    CAT: "Gato",
    BIRD: "Ave",
    OTHER: "Otro",
  };

  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className="flex size-10 items-center justify-center bg-[#EAF4F1] text-[#0F766E]">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-[#1D3A35]">{pet.name}</h3>
          <p className="mt-1 text-sm text-[#5C6F68]">
            {speciesLabel[pet.species]}
            {pet.breed ? ` · ${pet.breed}` : ""}
          </p>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block border border-[#DCE8E2] bg-[#FCFDFC] p-4 transition-colors hover:border-[#79A99C] hover:bg-[#F0F8F5]">
        {content}
      </Link>
    );
  }

  return <article className="border border-[#DCE8E2] bg-[#FCFDFC] p-4">{content}</article>;
}
