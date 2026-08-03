import { prisma } from "@/lib/prisma";
import AdminSectionPage from "@/features/admin/components/AdminSectionPage";
import { VetCard, VetsEmptyState, VetsPageHeader } from "@/features/dashboard/veterinarios/components";

export default async function VeterinariosPage() {
  const [vets, services] = await Promise.all([
    prisma.veterinarian.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        bio: true,
        phone: true,
        email: true,
        isActive: true,
      },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, durationMin: true },
    }),
  ]);

  return (
    <AdminSectionPage
      eyebrow="Equipo"
      title="Veterinarios"
      description="Gestiona los perfiles del equipo clínico y su asignación de citas."
      badge="Equipo"
    >
      <div className="space-y-6">
        <VetsPageHeader services={services} total={vets.length} />

        {vets.length === 0 ? (
          <VetsEmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vets.map((vet) => (
              <VetCard key={vet.id} vet={vet} />
            ))}
          </div>
        )}
      </div>
    </AdminSectionPage>
  );
}
