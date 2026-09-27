import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/shared/constants/theme";

type Professional = {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  role: "VETERINARY" | "GROOMING";
  services: Array<{
    service: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
};

type VeterinaryCardProps = {
  veterinarian: Professional;
  placeholderImage: string;
  eager?: boolean;
};

export default function VeterinaryCard({
  veterinarian: vet,
  placeholderImage,
  eager = false,
}: VeterinaryCardProps) {
  const imgSrc = vet.imageUrl || placeholderImage;
  const primaryService = vet.services[0]?.service;
  const reservationHref = vet.services.length === 1 && primaryService
    ? `/reservar?servicio=${primaryService.slug}&profesional=${vet.id}`
    : `/reservar?profesional=${vet.id}`;

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow: `0 14px 36px -26px ${COLORS.primary}`,
        border: `1px solid ${COLORS.border_light}`,
      }}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden" style={{ backgroundColor: COLORS.primary_bg }}>
        <Image
          src={imgSrc}
          alt={vet.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          loading={eager ? "eager" : "lazy"}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/55 via-[#0F172A]/10 to-transparent" />

        {vet.services.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
            {vet.services.slice(0, 2).map(({ service }) => (
              <span
                key={service.id}
                className="rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm"
                style={{ color: COLORS.primary }}
              >
                {service.name}
              </span>
            ))}
            {vet.services.length > 2 && (
              <span className="rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm" style={{ color: "#64748B" }}>
                +{vet.services.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight" style={{ color: COLORS.darker }}>
            {vet.name}
          </h3>
          {vet.bio && (
            <p className="line-clamp-3 text-sm leading-relaxed" style={{ color: COLORS.text_muted }}>
              {vet.bio}
            </p>
          )}
        </div>

        <Link
          href={reservationHref}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#0F766E] px-4 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2"
        >
          {vet.services.length > 0 ? "Reservar" : "Pedir hora"}
        </Link>
      </div>
    </article>
  );
}
