import { notFound } from "next/navigation";

import GoBackButton from "@/features/admin/components/GoBackButton";
import ArchiveCustomerButton from "@/features/dashboard/clients/components/ArchiveCustomerButton";
import AddPetButton from "@/features/pets/components/AddPetButton";
import PetCard from "@/features/pets/components/PetCard";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "@/features/dashboard/reservas/components/reservationStatus";
import { prisma } from "@/lib/prisma";
import { formatAppointmentDateTime, formatShortDate } from "@/utils/dateFormatters";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetails({ params }: Props) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      notes: true,
      isActive: true,
      createdAt: true,
      pets: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, species: true, breed: true, isActive: true },
      },
      reservations: {
        orderBy: { startAt: "desc" },
        take: 10,
        select: {
          id: true,
          serviceName: true,
          startAt: true,
          status: true,
          pet: { select: { name: true } },
          professional: { select: { name: true } },
        },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <GoBackButton />

      <header className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
          Cliente desde {formatShortDate(customer.createdAt)}
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1D3A35]">
              {customer.name}
            </h1>
            <div className="mt-2 flex flex-col gap-1 text-sm text-[#5C6F68] sm:flex-row sm:gap-4">
              <a href={`tel:${customer.phone}`} className="hover:text-[#0F766E]">
                {customer.phone}
              </a>
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="hover:text-[#0F766E]">
                  {customer.email}
                </a>
              )}
            </div>
            {!customer.isActive && (
              <span className="mt-3 inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Cliente dado de baja
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AddPetButton customerId={customer.id} customerName={customer.name} />
            {customer.isActive && <ArchiveCustomerButton customerId={customer.id} customerName={customer.name} />}
          </div>
        </div>
      </header>

      <section className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">
              Mascotas
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#1D3A35]">
              Compañeros registrados
            </h2>
          </div>
          <span className="text-sm font-semibold text-[#0F766E]">{customer.pets.length}</span>
        </div>

        {customer.pets.length === 0 ? (
          <p className="mt-5 border border-dashed border-[#B9D9CF] bg-[#F7FAF9] p-4 text-sm text-[#5C6F68]">
            Este cliente aún no tiene mascotas registradas.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customer.pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                href={`/admin/clientes/${customer.id}/mascotas/${pet.id}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Historial reciente
        </p>
        <h2 className="mt-1 text-xl font-bold text-[#1D3A35]">Reservas</h2>

        {customer.reservations.length === 0 ? (
          <p className="mt-5 border border-dashed border-[#B9D9CF] bg-[#F7FAF9] p-4 text-sm text-[#5C6F68]">
            No hay reservas registradas para este cliente.
          </p>
        ) : (
          <div className="mt-5 divide-y divide-[#E7EFEB] border-y border-[#E7EFEB]">
            {customer.reservations.map((reservation) => (
              <div key={reservation.id} className="grid gap-1 py-4 text-sm sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center sm:gap-4">
                <p className="font-semibold text-[#1D3A35]">{reservation.serviceName}</p>
                <p className="text-[#5C6F68]">{reservation.pet?.name ?? "Sin mascota"}</p>
                <p className="text-[#5C6F68]">{formatAppointmentDateTime(reservation.startAt)}</p>
                <span className={`w-fit border px-2.5 py-1 text-xs font-semibold ${RESERVATION_STATUS_STYLES[reservation.status]}`}>
                  {RESERVATION_STATUS_LABELS[reservation.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {customer.notes && (
        <section className="border border-[#DCE8E2] bg-[#F7FAF9] p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">Notas</p>
          <p className="mt-3 text-sm leading-relaxed text-[#5C6F68]">{customer.notes}</p>
        </section>
      )}
    </div>
  )
}
