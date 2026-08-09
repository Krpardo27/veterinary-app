import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  SLOT_INTERVAL_MINUTES,
  buildSlotStart,
  getActiveService,
  getAvailabilityCandidates,
  isInsideBusinessWindow,
  isValidReservationStart,
} from "@/features/booking/services/availability";

function isValidDateInput(date: string | null): date is string {
  return date !== null && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  const date = request.nextUrl.searchParams.get("date");
  const professionalId = request.nextUrl.searchParams.get("professionalId") ?? undefined;

  if (!serviceId || !isValidDateInput(date)) {
    return NextResponse.json(
      { error: "Servicio y fecha válidos son requeridos." },
      { status: 400 },
    );
  }

  const dayOfWeek = new Date(`${date}T12:00:00`).getDay();

  if (dayOfWeek === 0) {
    return NextResponse.json({ slots: [], closed: true });
  }

  const isSaturday = dayOfWeek === 6;
  const businessHours = isSaturday
    ? { openHour: 9, closeHour: 16, openMinute: 30, closeMinute: 30 }
    : undefined;
  const slotCount = isSaturday ? 14 : 22;

  const service = await getActiveService(prisma, serviceId);

  if (!service) {
    return NextResponse.json({ error: "Servicio no disponible." }, { status: 404 });
  }

  const candidates = await getAvailabilityCandidates(
    prisma,
    service,
    professionalId,
  );

  const slots = Array.from({ length: slotCount }, (_, index) => {
    const start = buildSlotStart(date, index * SLOT_INTERVAL_MINUTES, businessHours);
    const end = start
      ? new Date(start.getTime() + service.durationMin * 60 * 1000)
      : null;
    const isInsideHours = Boolean(
      start &&
        end &&
        isValidReservationStart(start, new Date(), businessHours) &&
        isInsideBusinessWindow({ start, end, businessHours }),
    );

    return {
      time: start
        ? `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`
        : "",
      start,
      end,
      isInsideHours,
    };
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      professionalId: { in: candidates.map((candidate) => candidate.professionalId) },
      status: { in: ["PENDING", "CONFIRMED"] },
      startAt: { lt: new Date(`${date}T${isSaturday ? "16:30" : "20:00"}:00`) },
      endAt: { gt: new Date(`${date}T09:00:00`) },
    },
    select: { professionalId: true, startAt: true, endAt: true },
  });

  return NextResponse.json({
    closed: false,
    slots: slots.map((slot) => ({
      time: slot.time,
      available:
        slot.isInsideHours &&
        candidates.some((candidate) => {
          const candidateEnd = new Date(
            slot.start!.getTime() + candidate.durationMin * 60 * 1000,
          );

          return !reservations.some(
            (reservation) =>
              reservation.professionalId === candidate.professionalId &&
              reservation.startAt < candidateEnd &&
              reservation.endAt > slot.start!,
          );
        }),
    })),
  });
}