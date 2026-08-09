import GoBackButton from "@/features/admin/components/GoBackButton";
import AddVetForm from "@/features/dashboard/veterinarios/components/AddVetForm";
import VetAdminForm from "@/features/dashboard/veterinarios/components/VetAdminForm";
import { prisma } from "@/lib/prisma";

export default async function NewVetPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, durationMin: true },
  });

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div>
        <h2 className="text-3xl font-bold text-zinc-900">Nuevo profesional</h2>
        <p className="mt-2 text-zinc-500">Agrega un perfil clínico o de peluquería al equipo.</p>
      </div>

      <AddVetForm services={services} successRedirectHref="/admin/veterinarios">
        <VetAdminForm />
      </AddVetForm>
    </div>
  );
}
