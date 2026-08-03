import type { ReservationStatus } from "@/generated/prisma/enums";

export type ReservationTableItem = {
  id: string;
  serviceName: string;
  servicePrice: number;
  durationMin: number;
  startAt: Date;
  status: ReservationStatus;
  customer: { name: string; phone: string };
  veterinarian: { name: string } | null;
};
