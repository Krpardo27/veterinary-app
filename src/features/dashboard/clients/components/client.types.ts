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