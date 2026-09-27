"use client";

import { useTransition } from "react";
import { FiDownload } from "react-icons/fi";
import { downloadCsv } from "@/shared/utils/csvExport";
import type { ClientExportCustomer } from "./client.types";

type ExportClientsButtonProps = {
  customers: ClientExportCustomer[];
};

function booleanLabel(value: boolean) {
  return value ? "Sí" : "No";
}

export default function ExportClientsButton({ customers }: ExportClientsButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const generatedAt = new Date().toISOString().slice(0, 10);

      const clientRows = customers.map((customer) => ({
        Nombre: customer.name,
        Teléfono: customer.phone,
        Email: customer.email ?? "",
        Activo: booleanLabel(customer.isActive),
        "Fecha de registro": customer.createdAtLabel,
        "Citas activas futuras": customer.activeReservationsCount,
        Mascotas: customer.pets.length,
        Notas: customer.notes ?? "",
      }));

      const petRows = customers.flatMap((customer) =>
        customer.pets.map((pet) => ({
          Cliente: customer.name,
          Teléfono: customer.phone,
          Mascota: pet.name,
          Especie: pet.species,
          Raza: pet.breed ?? "",
          Sexo: pet.sex ?? "",
          Nacimiento: pet.birthDateLabel ?? "",
          "Peso actual (kg)": pet.weight ?? "",
        })),
      );

      const reservationRows = customers.flatMap((customer) =>
        customer.reservations.map((reservation) => ({
          Cliente: customer.name,
          Teléfono: customer.phone,
          Mascota: reservation.petName ?? "",
          Servicio: reservation.serviceName,
          Estado: reservation.statusLabel,
          "Fecha y hora": reservation.startAtLabel,
          Profesional: reservation.professionalName ?? "",
          Duración: reservation.durationMin,
          Precio: reservation.servicePrice,
        })),
      );

      downloadCsv(`clientes-veterinaria-el-abrazo-${generatedAt}.csv`, clientRows);
      downloadCsv(`mascotas-veterinaria-el-abrazo-${generatedAt}.csv`, petRows);
      downloadCsv(`reservas-veterinaria-el-abrazo-${generatedAt}.csv`, reservationRows);
    });
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isPending || customers.length === 0}
      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#0F766E]/30 px-4 text-sm font-semibold text-[#0F766E] transition-colors hover:border-[#0F766E] hover:bg-[#0F766E]/5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <FiDownload className="h-4 w-4" />
      {isPending ? "Exportando..." : "Exportar clientes"}
    </button>
  );
}