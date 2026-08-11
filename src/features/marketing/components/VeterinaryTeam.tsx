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

async function getVeterinarians() {
  return prisma.professional.findMany({
    where: { isActive: true, role: "VETERINARY" },
    orderBy: { name: "asc" },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { service: { name: "asc" } },
        include: {
          service: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export default async function VeterinaryTeam() {
  const veterinarians = await getVeterinarians();

  if (veterinarians.length === 0) return null;

  return (
    <section id="equipo" className="relative overflow-hidden py-20 sm:py-24" style={{ backgroundColor: COLORS.bg_light }}>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full opacity-50 blur-3xl" style={{ backgroundColor: "#D1FAE5" }} />
        <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full opacity-60 blur-3xl" style={{ backgroundColor: COLORS.primary_bg }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <TeamHeader />

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {veterinarians.map((vet, i) => (
            <VeterinaryCard
              key={vet.id}
              veterinarian={vet}
              placeholderImage={PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
