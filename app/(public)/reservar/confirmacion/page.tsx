import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

import { prisma } from "@/lib/prisma";
import { formatDayMonthYearDateTime } from "@/utils/dateFormatters";

type ConfirmationPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    select: {
      id: true,
      serviceName: true,
      servicePrice: true,
      durationMin: true,
      startAt: true,
      customer: {
        select: { name: true },
      },
      pet: {
        select: { name: true },
      },
      professional: {
        select: { name: true },
      },
    },
  });

  if (!reservation) {
    notFound();
  }

  const formattedDate = formatDayMonthYearDateTime(reservation.startAt);
  const formattedPrice = `$${reservation.servicePrice.toLocaleString("es-CL")}`;

  return (
    <div className="min-h-screen bg-[#F7FAF9] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <header className="border border-[#B9D9CF] bg-[#F0F8F5] px-6 py-8 text-center sm:px-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#2A6A5D] text-white shadow-sm">
            <FaCheck aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Reserva registrada
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1D3A35] sm:text-4xl">
            Tu cita quedó agendada
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5C6F68] sm:text-base">
            Recibimos tu reserva. Si necesitamos confirmar algún dato, te contactaremos por teléfono o correo.
          </p>
        </header>

        <section className="border-x border-b border-[#DCE8E2] bg-white p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Detalle de la reserva
          </p>

          <dl className="mt-5 divide-y divide-[#E7EFEB]">
            <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-sm text-[#6F817A]">Dueño</dt>
              <dd className="text-sm font-semibold text-[#1D3A35] sm:text-right">
                {reservation.customer.name}
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-sm text-[#6F817A]">Servicio</dt>
              <dd className="text-sm font-semibold text-[#1D3A35] sm:text-right">
                {reservation.serviceName}
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-sm text-[#6F817A]">Mascota</dt>
              <dd className="text-sm font-semibold text-[#1D3A35] sm:text-right">
                {reservation.pet?.name ?? "Sin registrar"}
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-sm text-[#6F817A]">Fecha y hora</dt>
              <dd className="text-sm font-semibold capitalize text-[#1D3A35] sm:text-right">
                {formattedDate}
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-sm text-[#6F817A]">Profesional</dt>
              <dd className="text-sm font-semibold text-[#1D3A35] sm:text-right">
                {reservation.professional?.name ?? "Por asignar"}
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-sm text-[#6F817A]">Duración</dt>
              <dd className="text-sm font-semibold text-[#1D3A35] sm:text-right">
                {reservation.durationMin} minutos
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-sm text-[#6F817A]">Valor estimado</dt>
              <dd className="text-lg font-bold text-[#0F766E] sm:text-right">
                {formattedPrice}
              </dd>
            </div>
          </dl>

          <div className="mt-7 rounded-2xl border border-[#DCE8E2] bg-[#F7FAF9] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#52736A]">
              Antes de venir
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5C6F68]">
              <li>Llega 10 minutos antes de la hora agendada.</li>
              <li>Trae carnet de vacunas o exámenes recientes si corresponde.</li>
              <li>Si tu mascota toma medicamentos, trae el nombre o indicación.</li>
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-[#B9D9CF] bg-white p-4">
            <p className="text-sm font-semibold text-[#1D3A35]">
              ¿Necesitas cambiar tu hora?
            </p>
            <p className="mt-1 text-sm leading-6 text-[#5C6F68]">
              Llámanos si necesitas reagendar, cancelar o comentar algo antes de venir.
            </p>
            <a
              href="tel:+56221457892"
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 border border-[#B9D9CF] px-4 text-sm font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5] sm:w-auto"
            >
              <FiPhone className="h-4 w-4" />
              Llamar a la clínica
            </a>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/reservar"
              className="border border-[#B9D9CF] px-5 py-3 text-center text-sm font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
            >
              Nueva reserva
            </Link>
            <Link
              href="/"
              className="bg-[#2A6A5D] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1D554A]"
            >
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
