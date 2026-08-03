import Image from "next/image";
import { FiMail, FiPhone } from "react-icons/fi";
import { prisma } from "@/lib/prisma";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80",
];

async function getVeterinarians() {
  return prisma.veterinarian.findMany({
    where: { isActive: true },
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
    <section id="equipo" className="relative overflow-hidden bg-[#F7FAF9] py-20 sm:py-24">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#D1FAE5] opacity-50 blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#EAF4F1] opacity-60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-semibold text-[#0F766E]">
            🩺 Nuestro equipo
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Veterinarios que cuidan a tu mascota
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#64748B]">
            Profesionales certificados, especializados en distintas áreas del bienestar animal.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {veterinarians.map((vet, i) => {
            const imgSrc = vet.imageUrl || PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length];

            return (
              <article
                key={vet.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_4px_24px_-8px_rgba(15,118,110,0.12)] ring-1 ring-[#E2E8E5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(15,118,110,0.2)] hover:ring-[#0F766E]/30"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-[#EAF4F1]">
                  <Image
                    src={imgSrc}
                    alt={vet.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Service pills over image */}
                  {vet.services.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      {vet.services.slice(0, 2).map(({ service }) => (
                        <span
                          key={service.id}
                          className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#0F766E] backdrop-blur-sm"
                        >
                          {service.name}
                        </span>
                      ))}
                      {vet.services.length > 2 && (
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#94A3B8] backdrop-blur-sm">
                          +{vet.services.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#0F172A]">
                      {vet.name}
                    </h3>
                    {vet.bio && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#64748B]">
                        {vet.bio}
                      </p>
                    )}
                  </div>

                  {(vet.phone || vet.email) && (
                    <div className="mt-auto flex flex-col gap-2 border-t border-[#E2E8E5] pt-4">
                      {vet.phone && (
                        <a
                          href={`tel:${vet.phone}`}
                          className="flex items-center gap-2 text-xs text-[#64748B] transition-colors hover:text-[#0F766E]"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF4F1]">
                            <FiPhone className="h-3 w-3 text-[#0F766E]" />
                          </span>
                          {vet.phone}
                        </a>
                      )}
                      {vet.email && (
                        <a
                          href={`mailto:${vet.email}`}
                          className="flex items-center gap-2 text-xs text-[#64748B] transition-colors hover:text-[#0F766E]"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF4F1]">
                            <FiMail className="h-3 w-3 text-[#0F766E]" />
                          </span>
                          <span className="truncate">{vet.email}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
