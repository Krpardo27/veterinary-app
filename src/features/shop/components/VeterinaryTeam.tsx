import { prisma } from "@/lib/prisma";
import VeterinaryCard from "./VeterinaryCard";
import TeamHeader from "./TeamHeader";
import { COLORS } from "@/shared/constants/theme";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80",
];

const TEAM_GROUPS = [
  {
    role: "VETERINARY",
    title: "Veterinarios",
    description: "Atención clínica, preventiva y quirúrgica para cada etapa.",
  },
  {
    role: "GROOMING",
    title: "Peluqueria y baño",
    description: "Cuidado estético, higiene y bienestar con manejo paciente.",
  },
] as const;

async function getProfessionals() {
  return prisma.professional.findMany({
    where: { isActive: true },
    orderBy: [{ role: "desc" }, { name: "asc" }],
    include: {
      services: {
        where: { isActive: true },
        orderBy: { service: { name: "asc" } },
        include: {
          service: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });
}

export default async function VeterinaryTeam() {
  const professionals = await getProfessionals();

  if (professionals.length === 0) return null;

  const professionalsByRole = new Map(
    TEAM_GROUPS.map((group) => [
      group.role,
      professionals.filter((professional) => professional.role === group.role),
    ]),
  );
  const orderedProfessionals = TEAM_GROUPS.flatMap(
    (group) => professionalsByRole.get(group.role) ?? [],
  );
  const firstProfessionalId = orderedProfessionals[0]?.id;

  return (
    <section id="equipo" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24" style={{ backgroundColor: COLORS.bg_light }}>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full opacity-50 blur-3xl" style={{ backgroundColor: "#D1FAE5" }} />
        <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full opacity-60 blur-3xl" style={{ backgroundColor: COLORS.primary_bg }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <TeamHeader />

        <div className="mt-14 space-y-12">
          {TEAM_GROUPS.map((group) => {
            const groupProfessionals = professionalsByRole.get(group.role) ?? [];

            if (groupProfessionals.length === 0) return null;

            return (
              <section key={group.role} aria-labelledby={`${group.role.toLowerCase()}-heading`}>
                <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 id={`${group.role.toLowerCase()}-heading`} className="text-xl font-bold tracking-tight" style={{ color: COLORS.darker }}>
                      {group.title}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: COLORS.text_muted }}>
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {groupProfessionals.map((professional) => {
                    const professionalIndex = orderedProfessionals.findIndex(
                      (orderedProfessional) => orderedProfessional.id === professional.id,
                    );

                    return (
                      <VeterinaryCard
                        key={professional.id}
                        veterinarian={professional}
                        placeholderImage={PLACEHOLDER_IMAGES[professionalIndex % PLACEHOLDER_IMAGES.length]}
                        eager={professional.id === firstProfessionalId}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
