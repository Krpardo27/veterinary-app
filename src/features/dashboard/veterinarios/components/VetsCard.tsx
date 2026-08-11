import Link from "next/link";
import { FiBriefcase, FiEdit3, FiMail, FiPhone, FiUser } from "react-icons/fi";

type VetCardData = {
  id: string;
  name: string;
  bio: string | null;
  phone: string | null;
  email: string | null;
  role: "VETERINARY" | "GROOMING";
  isActive: boolean;
  _count: { reservations: number };
  services: Array<{ durationMin: number | null; service: { id: string; name: string; durationMin: number } }>;
};

type VetCardProps = {
  vet: VetCardData;
};

export default function VetCard({ vet }: VetCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-[#0F766E]/40 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
            <FiUser className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">{vet.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
            {vet.role === "VETERINARY" ? "Veterinario/a" : "Peluquería y baño"}
          </p>
          {vet.bio && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{vet.bio}</p>
          )}
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2 py-1 text-xs font-medium ${
            vet.isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {vet.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="grid gap-2 border-t border-zinc-100 py-4 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <FiPhone className="size-4 shrink-0 text-[#0F766E]" />
          {vet.phone ? <a href={`tel:${vet.phone}`} className="truncate hover:text-[#0F766E]">{vet.phone}</a> : <span className="text-zinc-400">Sin teléfono</span>}
        </div>
        <div className="flex items-center gap-2">
          <FiMail className="size-4 shrink-0 text-[#0F766E]" />
          {vet.email ? <a href={`mailto:${vet.email}`} className="truncate hover:text-[#0F766E]">{vet.email}</a> : <span className="text-zinc-400">Sin email</span>}
        </div>
      </div>

      <div className="space-y-2 border-t border-zinc-100 pt-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <FiBriefcase className="h-4 w-4 text-[#0F766E]" />
          Servicios asignados
        </div>
        {vet.services.length === 0 ? (
          <p className="text-sm text-zinc-500">Sin servicios asignados</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {vet.services.map(({ durationMin, service }) => (
              <span
                key={service.id}
                className="inline-flex items-center border border-[#B9D9CF] bg-[#F0F8F5] px-2 py-1 text-xs font-medium text-[#1D554A]"
              >
                {service.name} · {durationMin ?? service.durationMin} min
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        {vet._count.reservations} {vet._count.reservations === 1 ? "reserva asociada" : "reservas asociadas"}
      </p>

      <div className="mt-auto border-t border-zinc-100 pt-4">
        <Link
          href={`/admin/veterinarios/${vet.id}/edit`}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#0F766E]/30 px-4 text-xs font-bold uppercase tracking-wide text-[#0F766E] transition-colors hover:border-[#0F766E] hover:bg-[#0F766E]/5 sm:w-auto"
        >
          <FiEdit3 className="h-4 w-4" />
          Editar profesional
        </Link>
      </div>
    </div>
  );
}
