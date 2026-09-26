import Image from "next/image";
import { COLORS } from "@/shared/constants/theme";

type Professional = {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  services: Array<{
    service: {
      id: string;
      name: string;
    };
  }>;
};

type VeterinaryCardProps = {
  veterinarian: Professional;
  placeholderImage: string;
};

export default function VeterinaryCard({
  veterinarian: vet,
  placeholderImage,
}: VeterinaryCardProps) {
  const imgSrc = vet.imageUrl || placeholderImage;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow: `0 4px 24px -8px ${COLORS.primary}1f`,
        border: `1px solid ${COLORS.border_light}`,
      }}
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden" style={{ backgroundColor: COLORS.primary_bg }}>
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
                className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm"
                style={{ color: COLORS.primary }}
              >
                {service.name}
              </span>
            ))}
            {vet.services.length > 2 && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm" style={{ color: "#94A3B8" }}>
                +{vet.services.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight" style={{ color: COLORS.darker }}>
            {vet.name}
          </h3>
          {vet.bio && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed" style={{ color: COLORS.text_muted }}>
              {vet.bio}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
