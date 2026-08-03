import type { Service } from "@/generated/prisma/client";
import CreateVetButton from "./CreateVetButton";

type VetsPageHeaderProps = {
  services: Pick<Service, "id" | "name" | "durationMin">[];
  total: number;
};

export default function VetsPageHeader({ services, total }: VetsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        {total} {total === 1 ? "veterinario" : "veterinarios"} en total
      </p>
      <CreateVetButton services={services} />
    </div>
  );
}
