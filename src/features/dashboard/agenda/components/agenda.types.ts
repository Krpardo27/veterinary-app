import type { ProfessionalRole, ReservationStatus } from "@/generated/prisma/enums";

export type AgendaReservation = {
  id: string;
  serviceName: string;
  servicePrice: number;
  startAt: Date;
  endAt: Date;
  status: ReservationStatus;
  customer: { name: string };
  pet: { name: string } | null;
  professional: { id: string; name: string } | null;
};

export type AgendaProfessional = {
  id: string;
  name: string;
  role: ProfessionalRole;
};

export type AgendaSlot = {
  start: Date;
  end: Date;
};
