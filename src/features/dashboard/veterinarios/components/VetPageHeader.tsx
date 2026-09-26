import type { Service } from "@/generated/prisma/client";
import CreateVetButton from "./CreateVetButton";

type VetsPageHeaderProps = {
  services: Array<Pick<Service, "id" | "name" | "slug" | "durationMin"> & { category?: { slug: string } | null }>;
  total: number;
  activeCount: number;
  inactiveCount: number;
  veterinaryCount: number;
  groomingCount: number;
};

export default function VetsPageHeader({
  services,
  total,
  activeCount,
  inactiveCount,
  veterinaryCount,
  groomingCount,
}: VetsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
        <div>
          <p className="text-2xl font-bold text-zinc-900">{total}</p>
          <p className="text-xs text-zinc-500">Total</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#0F766E]">{activeCount}</p>
          <p className="text-xs text-zinc-500">Activos</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-500">{inactiveCount}</p>
          <p className="text-xs text-zinc-500">Inactivos</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900">{veterinaryCount}</p>
          <p className="text-xs text-zinc-500">Veterinaria</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900">{groomingCount}</p>
          <p className="text-xs text-zinc-500">Peluquería</p>
        </div>
      </div>
      <CreateVetButton services={services} />
    </div>
  );
}
