import EditPetButton from "./EditPetButton";
import { SPECIES_LABELS, SEX_LABELS } from "../constants/petLabels";
import { formatShortDate } from "@/utils/dateFormatters";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birthDate: Date | null;
  weight: number | null;
  color: string | null;
  notes: string | null;
  customer: { id: string; name: string };
};

export default function PetProfileSection({ pet }: { pet: Pet }) {
  return (
    <>
      <header className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
          Mascota de {pet.customer.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1D3A35]">{pet.name}</h1>
        <p className="mt-2 text-sm text-[#5C6F68]">
          {SPECIES_LABELS[pet.species as keyof typeof SPECIES_LABELS]}
          {pet.breed ? ` · ${pet.breed}` : ""}
        </p>
      </header>

      <section className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">Perfil</p>
          <EditPetButton
            customerId={pet.customer.id}
            pet={{
              id: pet.id,
              name: pet.name,
              species: pet.species as "DOG" | "CAT" | "BIRD" | "OTHER",
              breed: pet.breed,
              sex: pet.sex as "MALE" | "FEMALE" | "UNKNOWN" | null,
              birthDate: pet.birthDate,
              color: pet.color,
              notes: pet.notes,
            }}
          />
        </div>

        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[#6F817A]">Sexo</p>
            <p className="mt-1 font-semibold text-[#1D3A35]">
              {pet.sex ? SEX_LABELS[pet.sex as keyof typeof SEX_LABELS] : "Sin registrar"}
            </p>
          </div>

          <div>
            <p className="text-[#6F817A]">Nacimiento</p>
            <p className="mt-1 font-semibold text-[#1D3A35]">
              {pet.birthDate ? formatShortDate(pet.birthDate) : "Sin registrar"}
            </p>
          </div>

          <div>
            <p className="text-[#6F817A]">Color</p>
            <p className="mt-1 font-semibold text-[#1D3A35]">{pet.color ?? "Sin registrar"}</p>
          </div>

          <div>
            <p className="text-[#6F817A]">Peso actual</p>
            <p className="mt-1 font-semibold text-[#0F766E]">
              {pet.weight ? `${pet.weight} kg` : "Sin registrar"}
            </p>
          </div>
        </div>

        {pet.notes && (
          <p className="mt-5 border-t border-[#E7EFEB] pt-4 text-sm leading-relaxed text-[#5C6F68]">
            {pet.notes}
          </p>
        )}
      </section>
    </>
  );
}
