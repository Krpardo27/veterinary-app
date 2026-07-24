import type { IconType } from "react-icons";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: IconType;
};

export default function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-[#e3d8c0] bg-white/80 p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e7d5] text-[#c96f4d]">
        <Icon className="text-xl" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#23362e]">{title}</h3>
      <p className="mt-3 text-base leading-7 text-[#6b635b]">{description}</p>
    </article>
  );
}