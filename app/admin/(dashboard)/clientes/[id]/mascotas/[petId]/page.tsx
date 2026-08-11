import { notFound } from "next/navigation";

import GoBackButton from "@/features/admin/components/GoBackButton";
import PetProfileSection from "@/features/pets/components/PetProfileSection";
import PetHealthSection from "@/features/pets/components/PetHealthSection";
import PetReservationHistory from "@/features/pets/components/PetReservationHistory";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string; petId: string }>;
};

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
      <PetProfileSection pet={pet} />
      <PetHealthSection
        petId={pet.id}
        weightRecords={pet.weightRecords}
        vaccinations={pet.vaccinations}
      />
      <PetReservationHistory reservations={pet.reservations} />
    </div>
  );
}