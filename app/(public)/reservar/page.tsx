import ReservationForm from "@/features/booking/components/ReservationForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SUPPORTED_SEARCH_PARAMS = new Set(["servicio", "profesional"]);

function hasSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  return Object.prototype.hasOwnProperty.call(params, key);
}

function readSingleSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  if (value === undefined) return undefined;
  if (Array.isArray(value)) return null;

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
}

export default async function ReservarPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  if (Object.keys(params).some((key) => !SUPPORTED_SEARCH_PARAMS.has(key))) {
    notFound();
  }

  const serviceSlug = readSingleSearchParam(params, "servicio");
  const professionalId = readSingleSearchParam(params, "profesional");

  if (
    (hasSearchParam(params, "servicio") && !serviceSlug) ||
    (hasSearchParam(params, "profesional") && !professionalId)
  ) {
    notFound();
  }

  const [services, professionals] = await Promise.all([
    prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: { select: { slug: true, name: true } },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.professional.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        services: {
          where: { isActive: true },
          select: { serviceId: true },
        },
      },
    }),
  ]);

  const defaultService = serviceSlug
    ? services.find(
        (service) => service.slug === serviceSlug
      )
    : undefined;

  if (serviceSlug && !defaultService) {
    notFound();
  }

  const defaultProfessional = professionalId
    ? professionals.find(
      (professional) =>
        professional.id === professionalId &&
        (!defaultService || professional.services.some((service) => service.serviceId === defaultService.id)),
    )
    : undefined;

  if (professionalId && !defaultProfessional) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F7FAF9] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Agenda tu visita
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1D3A35] sm:text-4xl">
            Reserva la atención de tu mascota
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#5C6F68] sm:text-base">
            Elige el servicio, horario y cuéntanos cómo podemos ayudarte.
          </p>
        </header>

        <div className="border border-[#DCE8E2] bg-white p-5 shadow-sm sm:p-8">
        <ReservationForm
          services={services}
          professionals={professionals.map(({ services, ...professional }) => ({
            ...professional,
            serviceIds: services.map((service) => service.serviceId),
          }))}
          defaultServiceId={defaultService?.id}
          defaultProfessionalId={defaultProfessional?.id}
        />
        </div>
      </div>
    </div>
  );
}