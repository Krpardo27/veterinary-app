import type { ReservationStatus } from "@/generated/prisma/enums";

export interface ClientReservation {
  id: string;
  serviceName: string;
  startAtLabel: string;
  status: ReservationStatus;
}

export interface ClientTableCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAtLabel: string;
  activeReservationsCount: number;
  reservations: ClientReservation[];
}

export interface ClientExportCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAtLabel: string;
  activeReservationsCount: number;
  pets: Array<{
    id: string;
    name: string;
    species: string;
    breed: string | null;
    sex: string | null;
    birthDateLabel: string | null;
    weight: number | null;
  }>;
  reservations: Array<{
    id: string;
    serviceName: string;
    servicePrice: number;
    durationMin: number;
    startAtLabel: string;
    statusLabel: string;
    petName: string | null;
    professionalName: string | null;
  }>;
}