import GoBackButton from "@/features/admin/components/GoBackButton";
import EditVetForm from "@/features/dashboard/veterinarios/components/EditVetForm";
import VetAdminForm from "@/features/dashboard/veterinarios/components/VetAdminForm";
import { prisma } from "@/lib/prisma";
import Heading from "@/shared/ui/Heading";
import { notFound } from "next/navigation";

type EditVetPageProps = {
  params: Promise<{ id?: string }>;
};

export default async function EditVetPage({ params }: EditVetPageProps) {
  const { id } = await params;

  if (!id) notFound();

  const vet = await prisma.professional.findUnique({
    where: { id },
    include: {
      services: {
        select: { serviceId: true, durationMin: true, isActive: true },
      },
    },
  });

  if (!vet) notFound();

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, durationMin: true },
  });

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div>
        <Heading level={2}>Editar profesional</Heading>
        <p className="mt-2 text-zinc-500">Actualiza los datos de {vet.name}.</p>
      </div>

      <EditVetForm vet={vet} services={services} successRedirectHref="/admin/veterinarios">
        <VetAdminForm />
      </EditVetForm>
    </div>
  );
}
