import { prisma } from "@/lib/prisma";
import AdminSectionPage from "@/features/admin/components/AdminSectionPage";
import { VetCard, VetsEmptyState, VetsPageHeader } from "@/features/dashboard/veterinarios/components";

export default async function VeterinariosPage() {
  const [professionals, services] = await Promise.all([
    prisma.professional.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        bio: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        _count: { select: { reservations: true } },
        services: {
          where: { isActive: true },
          select: { durationMin: true, service: { select: { id: true, name: true, durationMin: true } } },
        },
      },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, durationMin: true },
    }),
  ]);
  const activeCount = professionals.filter((professional) => professional.isActive).length;
  const inactiveCount = professionals.length - activeCount;

  return (
    <AdminSectionPage
      eyebrow="Equipo"
      title="Profesionales"
      description="Gestiona perfiles, especialidades y asignación de servicios."
      badge="Equipo"
    >
      <div className="space-y-6">
        <VetsPageHeader
          services={services}
          total={professionals.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />

        {professionals.length === 0 ? (
          <VetsEmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {professionals.map((vet) => (
              <VetCard key={vet.id} vet={vet} />
            ))}
          </div>
        )}
      </div>
    </AdminSectionPage>
  );
}
