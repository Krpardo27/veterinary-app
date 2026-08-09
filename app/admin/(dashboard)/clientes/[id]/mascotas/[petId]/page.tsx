import { notFound } from "next/navigation";

import GoBackButton from "@/features/admin/components/GoBackButton";
import EditPetButton from "@/features/pets/components/EditPetButton";
import PetHealthForms from "@/features/pets/components/PetHealthForms";
import PetHealthHistory from "@/features/pets/components/PetHealthHistory";
import { prisma } from "@/lib/prisma";
import { formatAppointmentDateTime, formatShortDate } from "@/utils/dateFormatters";

type Props = {
  params: Promise<{ id: string; petId: string }>;
};

const SPECIES_LABELS = {
  DOG: "Perro",
  CAT: "Gato",
  BIRD: "Ave",
  OTHER: "Otro",
} as const;

const SEX_LABELS = {
  MALE: "Macho",
  FEMALE: "Hembra",
  UNKNOWN: "Sin registrar",
} as const;

const STATUS_LABELS = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
} as const;

export default async function PetDetailsPage({ params }: Props) {
  const { id: customerId, petId } = await params;
  const pet = await prisma.pet.findFirst({
    where: { id: petId, customerId },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      sex: true,
      birthDate: true,
      weight: true,
      color: true,
      notes: true,
      customer: { select: { id: true, name: true } },
      weightRecords: {
        orderBy: { measuredAt: "desc" },
        take: 12,
        select: { id: true, weight: true, measuredAt: true, notes: true },
      },
      vaccinations: {
        orderBy: { appliedAt: "desc" },
        take: 12,
        select: { id: true, vaccineName: true, appliedAt: true, nextDueAt: true, notes: true },
      },
      reservations: {
        orderBy: { startAt: "desc" },
        take: 12,
        select: {
          id: true,
          serviceName: true,
          startAt: true,
          status: true,
          professional: { select: { name: true } },
        },
      },
    },
  });

  if (!pet) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <GoBackButton />

      <header className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
          Mascota de {pet.customer.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1D3A35]">{pet.name}</h1>
        <p className="mt-2 text-sm text-[#5C6F68]">
          {SPECIES_LABELS[pet.species]}
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
              species: pet.species,
              breed: pet.breed,
              sex: pet.sex,
              birthDate: pet.birthDate,
              color: pet.color,
              notes: pet.notes,
            }}
          />
        </div>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-[#6F817A]">Sexo</p><p className="mt-1 font-semibold text-[#1D3A35]">{pet.sex ? SEX_LABELS[pet.sex] : "Sin registrar"}</p></div>
          <div><p className="text-[#6F817A]">Nacimiento</p><p className="mt-1 font-semibold text-[#1D3A35]">{pet.birthDate ? formatShortDate(pet.birthDate) : "Sin registrar"}</p></div>
          <div><p className="text-[#6F817A]">Color</p><p className="mt-1 font-semibold text-[#1D3A35]">{pet.color ?? "Sin registrar"}</p></div>
          <div><p className="text-[#6F817A]">Peso actual</p><p className="mt-1 font-semibold text-[#0F766E]">{pet.weight ? `${pet.weight} kg` : "Sin registrar"}</p></div>
        </div>
        {pet.notes && <p className="mt-5 border-t border-[#E7EFEB] pt-4 text-sm leading-relaxed text-[#5C6F68]">{pet.notes}</p>}
      </section>

      <section className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">Salud</p><h2 className="mt-1 text-xl font-bold text-[#1D3A35]">Peso y vacunas</h2></div>
          <PetHealthForms petId={pet.id} />
        </div>

        <PetHealthHistory
          petId={pet.id}
          weightRecords={pet.weightRecords}
          vaccinations={pet.vaccinations}
        />
      </section>

      <section className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">Historial de atención</p>
        <h2 className="mt-1 text-xl font-bold text-[#1D3A35]">Reservas</h2>
        {pet.reservations.length === 0 ? <p className="mt-4 text-sm text-[#6F817A]">Aún no hay reservas asociadas a esta mascota.</p> : (
          <div className="mt-5 divide-y divide-[#E7EFEB] border-y border-[#E7EFEB]">
            {pet.reservations.map((reservation) => <div key={reservation.id} className="grid gap-1 py-4 text-sm sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center sm:gap-4"><p className="font-semibold text-[#1D3A35]">{reservation.serviceName}</p><p className="text-[#5C6F68]">{reservation.professional?.name ?? "Por asignar"}</p><p className="text-[#5C6F68]">{formatAppointmentDateTime(reservation.startAt)}</p><span className="text-xs font-semibold text-[#0F766E]">{STATUS_LABELS[reservation.status]}</span></div>)}
          </div>
        )}
      </section>
    </div>
  );
}