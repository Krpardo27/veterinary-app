import ReservationForm from "@/features/booking/components/ReservationForm";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    servicio?: string;
  }>;
};

export default async function ReservarPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const [services, professionals] = await Promise.all([
    prisma.service.findMany({
      where: {
        isActive: true,
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

  const defaultService = params.servicio
    ? services.find(
        (service) => service.slug === params.servicio
      )
    : undefined;

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
        />
        </div>
      </div>
    </div>
  );
}