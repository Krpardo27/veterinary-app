import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ReservationStatus } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";
import ClientsTable from "@/features/dashboard/clients/components/ClientsTable";
import ExportClientsButton from "@/features/dashboard/clients/components/ExportClientsButton";
import Pagination from "@/features/admin/components/Pagination";
import { ACTIVE_RESERVATION_STATUSES } from "@/features/booking/services/availability";
import {
  formatAppointmentDateTime,
  formatShortDate,
} from "@/utils/dateFormatters";
import Heading from "@/shared/ui/Heading";
import AdminSearch from "@/features/admin/components/AdminSearch";
import {
  RESERVATION_STATUS_LABELS,
} from "@/features/dashboard/reservas/components/reservationStatus";

const ITEMS_PER_PAGE = 10;

type CustomerWithReservations = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  reservations: Array<{
    id: string;
    serviceName: string;
    startAt: Date;
    status: ReservationStatus;
  }>;
  _count: { reservations: number };
};

type ExportCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  pets: Array<{
    id: string;
    name: string;
    species: string;
    breed: string | null;
    sex: string | null;
    birthDate: Date | null;
    weight: number | null;
  }>;
  reservations: Array<{
    id: string;
    serviceName: string;
    servicePrice: number;
    durationMin: number;
    startAt: Date;
    status: ReservationStatus;
    pet: { name: string } | null;
    professional: { name: string } | null;
  }>;
  _count: { reservations: number };
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const pageNumber = Number(page);
  const currentPage =
    Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const query = q?.trim() || "";
  const now = new Date();

  const where: Prisma.CustomerWhereInput = {
    isActive: true,
    ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
        ],
      }),
  };

  const totalItems = await prisma.customer.count({ where });
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalPages > 0 && currentPage > totalPages) {
    const params = new URLSearchParams({ page: String(totalPages) });

    if (query) {
      params.set("q", query);
    }

    redirect(`/admin/clientes?${params.toString()}`);
  }

  const [customers, exportCustomers]: [CustomerWithReservations[], ExportCustomer[]] = await Promise.all([
    prisma.customer.findMany({
    where,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      notes: true,
      isActive: true,
      createdAt: true,
      reservations: {
        where: {
          status: { in: ACTIVE_RESERVATION_STATUSES },
          startAt: { gte: now },
        },
        orderBy: { startAt: "asc" },
        take: 1,
        select: {
          id: true,
          serviceName: true,
          startAt: true,
          status: true,
        },
      },
      _count: {
        select: {
          reservations: {
            where: {
              status: { in: ACTIVE_RESERVATION_STATUSES },
              startAt: { gte: now },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: ITEMS_PER_PAGE,
    }),
    prisma.customer.findMany({
      where,
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
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            sex: true,
            birthDate: true,
            weight: true,
          },
        },
        reservations: {
          orderBy: { startAt: "desc" },
          select: {
            id: true,
            serviceName: true,
            servicePrice: true,
            durationMin: true,
            startAt: true,
            status: true,
            pet: { select: { name: true } },
            professional: { select: { name: true } },
          },
        },
        _count: {
          select: {
            reservations: {
              where: {
                status: { in: ACTIVE_RESERVATION_STATUSES },
                startAt: { gte: now },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const customersForTable = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    notes: customer.notes,
    isActive: customer.isActive,
    createdAtLabel: formatShortDate(customer.createdAt),
    activeReservationsCount: customer._count.reservations,
    reservations: customer.reservations.map((reservation) => ({
      id: reservation.id,
      serviceName: reservation.serviceName,
      status: reservation.status,
      startAtLabel: formatAppointmentDateTime(reservation.startAt),
    })),
  }));

  const customersForExport = exportCustomers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    notes: customer.notes,
    isActive: customer.isActive,
    createdAtLabel: formatShortDate(customer.createdAt),
    activeReservationsCount: customer._count.reservations,
    pets: customer.pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex,
      birthDateLabel: pet.birthDate ? formatShortDate(pet.birthDate) : null,
      weight: pet.weight,
    })),
    reservations: customer.reservations.map((reservation) => ({
      id: reservation.id,
      serviceName: reservation.serviceName,
      servicePrice: reservation.servicePrice,
      durationMin: reservation.durationMin,
      startAtLabel: formatAppointmentDateTime(reservation.startAt),
      statusLabel: RESERVATION_STATUS_LABELS[reservation.status],
      petName: reservation.pet?.name ?? null,
      professionalName: reservation.professional?.name ?? null,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <Heading level={1}>Clientes</Heading>
        <p className="mt-2 text-zinc-500">Gestión de clientes registrados</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearch
          initialQuery={query}
          placeholder="Buscar por nombre, teléfono, email o notas"
          className="flex-1"
        />
        <ExportClientsButton customers={customersForExport} />
      </div>

      <ClientsTable
        customers={customersForTable}
        emptyMessage={query ? "No hay clientes que coincidan con la búsqueda." : undefined}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        itemLabel="clientes"
      />
    </div>
  );
}
