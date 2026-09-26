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
      select: { id: true, name: true, slug: true, durationMin: true, category: { select: { slug: true } } },
    }),
  ]);
  const activeCount = professionals.filter((professional) => professional.isActive).length;
  const inactiveCount = professionals.length - activeCount;
  const veterinaryCount = professionals.filter((professional) => professional.role === "VETERINARY").length;
  const groomingCount = professionals.filter((professional) => professional.role === "GROOMING").length;

  return (
    <AdminSectionPage
      eyebrow="Equipo"
      title="Profesionales"
      description="Gestiona profesionales de veterinaria y peluquería, sus servicios y disponibilidad."
      badge="Equipo"
    >
      <div className="space-y-6">
        <VetsPageHeader
          services={services}
          total={professionals.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          veterinaryCount={veterinaryCount}
          groomingCount={groomingCount}
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
