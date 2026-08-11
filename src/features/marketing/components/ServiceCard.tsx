import type { IconType } from "react-icons";
import { COLORS } from "@/shared/constants/theme";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: IconType;
};

export default function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <article
      className="rounded-3xl border p-6"
      style={{ borderColor: COLORS.border, backgroundColor: "rgba(255,255,255,0.85)" }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: COLORS.secondary_bg, color: COLORS.secondary }}
      >
        <Icon className="text-xl" />
      </div>
      <h3 className="mt-5 text-xl font-semibold" style={{ color: COLORS.dark }}>
        {title}
      </h3>
      <p className="mt-3 text-base leading-7" style={{ color: COLORS.text }}>
        {description}
      </p>
    </article>
  );
}
