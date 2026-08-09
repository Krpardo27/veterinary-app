import { describe, expect, it, vi } from "vitest";

import {
  findAvailableProfessional,
  isInsideBusinessWindow,
  isValidReservationStart,
} from "./availability";
import { parseBusinessDateTimeInput } from "@/shared/utils/businessTime";

type FindAvailableProfessionalDb = {
  professional: {
    findMany: ReturnType<typeof vi.fn>;
  };
  reservation: {
    findMany: ReturnType<typeof vi.fn>;
  };
};

describe("availability", () => {
  describe("isValidReservationStart", () => {
    it("acepta hora futura alineada al intervalo", () => {
      const now = parseBusinessDateTimeInput("2026-07-10T09:00:00")!;
      const start = parseBusinessDateTimeInput("2026-07-10T09:30:00")!;

      expect(isValidReservationStart(start, now)).toBe(true);
    });

    it("rechaza horas fuera de intervalo o fuera de jornada", () => {
      const now = parseBusinessDateTimeInput("2026-07-10T09:00:00")!;
      const misaligned = parseBusinessDateTimeInput("2026-07-10T09:07:00")!;
      const atClosing = parseBusinessDateTimeInput("2026-07-10T20:00:00")!;

      expect(isValidReservationStart(misaligned, now)).toBe(false);
      expect(isValidReservationStart(atClosing, now)).toBe(false);
    });

    it("rechaza horarios en pasado o en el mismo instante", () => {
      const now = parseBusinessDateTimeInput("2026-07-10T09:30:00")!;
      const same = parseBusinessDateTimeInput("2026-07-10T09:30:00")!;
      const past = parseBusinessDateTimeInput("2026-07-10T09:00:00")!;

      expect(isValidReservationStart(same, now)).toBe(false);
      expect(isValidReservationStart(past, now)).toBe(false);
    });
  });

  describe("isInsideBusinessWindow", () => {
    it("acepta ventanas dentro de apertura y cierre", () => {
      const start = parseBusinessDateTimeInput("2026-07-10T19:30:00")!;
      const end = parseBusinessDateTimeInput("2026-07-10T20:00:00")!;

      expect(isInsideBusinessWindow({ start, end })).toBe(true);
    });

    it("rechaza ventanas que terminan fuera de cierre", () => {
      const start = parseBusinessDateTimeInput("2026-07-10T19:30:00")!;
      const end = parseBusinessDateTimeInput("2026-07-10T20:01:00")!;

      expect(isInsideBusinessWindow({ start, end })).toBe(false);
    });

    it("rechaza ventanas que cruzan de día", () => {
      const start = parseBusinessDateTimeInput("2026-07-10T19:30:00")!;
      const end = parseBusinessDateTimeInput("2026-07-11T09:00:00")!;

      expect(isInsideBusinessWindow({ start, end })).toBe(false);
    });
  });

  describe("findAvailableProfessional", () => {
    it("resuelve profesional disponible evitando conflictos en memoria", async () => {
      const db: FindAvailableProfessionalDb = {
        professional: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: "b1",
              name: "Veterinario 1",
              services: [{ durationMin: 30, isActive: true }],
            },
            {
              id: "b2",
              name: "Veterinario 2",
              services: [{ durationMin: 30, isActive: true }],
            },
          ]),
        },
        reservation: {
          findMany: vi.fn().mockResolvedValue([
            {
              professionalId: "b1",
              startAt: parseBusinessDateTimeInput("2026-07-10T10:00:00"),
              endAt: parseBusinessDateTimeInput("2026-07-10T10:30:00"),
            },
          ]),
        },
      };

      const start = parseBusinessDateTimeInput("2026-07-10T10:00:00")!;
      const service = {
        id: "s1",
        name: "Corte",
        price: 10000,
        durationMin: 30,
      };

      const available = await findAvailableProfessional(db as never, { service, start });

      expect(available?.professionalId).toBe("b2");
      expect(db.reservation.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
