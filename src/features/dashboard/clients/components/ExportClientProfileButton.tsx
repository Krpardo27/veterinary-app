"use client";

import { useTransition } from "react";
import { FiDownload } from "react-icons/fi";
import { downloadCsv } from "@/shared/utils/csvExport";

type ClientProfileExport = {
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAtLabel: string;
  pets: Array<{
    name: string;
    species: string;
    breed: string | null;
    sex: string | null;
    birthDateLabel: string | null;
    color: string | null;
    weight: number | null;
    notes: string | null;
    weightRecords: Array<{ weight: number; measuredAtLabel: string; notes: string | null }>;
    vaccinations: Array<{ vaccineName: string; appliedAtLabel: string; nextDueAtLabel: string | null; notes: string | null }>;
  }>;
  reservations: Array<{
    serviceName: string;
    statusLabel: string;
    startAtLabel: string;
    petName: string | null;
    professionalName: string | null;
  }>;
};

type ExportClientProfileButtonProps = {
  customer: ClientProfileExport;
};

function statusLabel(value: boolean) {
  return value ? "Activo" : "Dado de baja";
}

function fileSafeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cliente";
}

export default function ExportClientProfileButton({ customer }: ExportClientProfileButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const generatedAt = new Date().toISOString().slice(0, 10);
      const filePrefix = `ficha-${fileSafeName(customer.name)}-${generatedAt}`;
      const profileRows = customer.pets.length > 0
        ? customer.pets.map((pet) => ({
          Cliente: customer.name,
          Teléfono: customer.phone,
          Email: customer.email ?? "",
          "Estado cliente": statusLabel(customer.isActive),
          "Cliente desde": customer.createdAtLabel,
          Mascota: pet.name,
          Especie: pet.species,
          Raza: pet.breed ?? "",
          Sexo: pet.sex ?? "",
          Nacimiento: pet.birthDateLabel ?? "",
          Color: pet.color ?? "",
          "Peso actual (kg)": pet.weight ?? "",
          "Notas mascota": pet.notes ?? "",
          "Notas cliente": customer.notes ?? "",
        }))
        : [{
          Cliente: customer.name,
          Teléfono: customer.phone,
          Email: customer.email ?? "",
          "Estado cliente": statusLabel(customer.isActive),
          "Cliente desde": customer.createdAtLabel,
          Mascota: "Sin mascotas registradas",
          Especie: "",
          Raza: "",
          Sexo: "",
          Nacimiento: "",
          Color: "",
          "Peso actual (kg)": "",
          "Notas mascota": "",
          "Notas cliente": customer.notes ?? "",
        }];

      downloadCsv(`${filePrefix}-ficha-completa.csv`, profileRows);
      downloadCsv(
        `${filePrefix}-cliente.csv`,
        [
          {
            Nombre: customer.name,
            Teléfono: customer.phone,
            Email: customer.email ?? "",
            Estado: statusLabel(customer.isActive),
            "Cliente desde": customer.createdAtLabel,
            Notas: customer.notes ?? "",
          },
        ],
      );

      downloadCsv(
        `${filePrefix}-mascotas.csv`,
        customer.pets.map((pet) => ({
          Mascota: pet.name,
          Especie: pet.species,
          Raza: pet.breed ?? "",
          Sexo: pet.sex ?? "",
          Nacimiento: pet.birthDateLabel ?? "",
          Color: pet.color ?? "",
          "Peso actual (kg)": pet.weight ?? "",
          Notas: pet.notes ?? "",
        })),
      );

      downloadCsv(
        `${filePrefix}-reservas.csv`,
        customer.reservations.map((reservation) => ({
          Servicio: reservation.serviceName,
          Estado: reservation.statusLabel,
          "Fecha y hora": reservation.startAtLabel,
          Mascota: reservation.petName ?? "",
          Profesional: reservation.professionalName ?? "",
        })),
      );

      downloadCsv(
        `${filePrefix}-controles-de-peso.csv`,
        customer.pets.flatMap((pet) =>
          pet.weightRecords.map((record) => ({
            Mascota: pet.name,
            Peso: record.weight,
            Fecha: record.measuredAtLabel,
            Notas: record.notes ?? "",
          })),
        ),
      );

      downloadCsv(
        `${filePrefix}-vacunas.csv`,
        customer.pets.flatMap((pet) =>
          pet.vaccinations.map((record) => ({
            Mascota: pet.name,
            Vacuna: record.vaccineName,
            Aplicación: record.appliedAtLabel,
            "Próxima dosis": record.nextDueAtLabel ?? "",
            Notas: record.notes ?? "",
          })),
        ),
      );
    });
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isPending}
      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#0F766E]/30 px-3 text-xs font-semibold text-[#0F766E] transition-colors hover:border-[#0F766E] hover:bg-[#0F766E]/5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FiDownload className="h-4 w-4" />
      {isPending ? "Exportando..." : "Exportar ficha"}
    </button>
  );
}