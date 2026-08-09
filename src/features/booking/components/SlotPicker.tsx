"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";

import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { getBusinessDateOnly } from "@/shared/utils/businessTime";

const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

function getDayName(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return DAY_NAMES[date.getUTCDay()] ?? "este día";
}

function dateFromInput(dateInput: string): Date {
  return new Date(`${dateInput}T12:00:00`);
}

function dateToInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

type Props = {
  serviceId: string;
  professionalId?: string;
  value: string;
  onChange: (isoString: string) => void;
};

export default function SlotPicker({
  serviceId,
  professionalId,
  value,
  onChange,
}: Props) {
  const today = getBusinessDateOnly();

  const [selectedDate, setSelectedDate] = useState(today);

  const { slots, loading, closed } = useAvailableSlots(
    serviceId,
    selectedDate,
    professionalId,
  );

  const handleSlot = (time: string) => {
    onChange(`${selectedDate}T${time}:00`);
  };

  const selectedTime = value?.split("T")[1]?.slice(0, 5);

  const showInitialLoading = loading && slots.length === 0;
  const selectedDay = dateFromInput(selectedDate);
  const todayDate = dateFromInput(today);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)]">
      <section className="border border-[#DCE8E2] bg-[#FCFDFC]">
        <div className="border-b border-[#E7EFEB] px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Elige una fecha
          </p>
        </div>

        <div className="p-3 sm:p-4">
          <DayPicker
            mode="single"
            locale={es}
            selected={selectedDay}
            onSelect={(date) => {
              if (!date) return;

              setSelectedDate(dateToInput(date));
              onChange("");
            }}
            disabled={[{ before: todayDate }, { dayOfWeek: [0] }]}
            startMonth={todayDate}
            defaultMonth={selectedDay}
            navLayout="around"
            classNames={{
              root: "w-full text-[#1D3A35]",
              months: "w-full",
              month: "w-full",
              month_caption: "flex h-10 items-center justify-center",
              caption_label: "text-sm font-semibold capitalize text-[#1D3A35]",
              nav: "flex items-center justify-between",
              button_previous:
                "flex size-9 items-center justify-center border border-[#DCE8E2] text-[#2A6A5D] transition-colors hover:bg-[#F0F8F5]",
              button_next:
                "flex size-9 items-center justify-center border border-[#DCE8E2] text-[#2A6A5D] transition-colors hover:bg-[#F0F8F5]",
              month_grid: "mt-2 w-full border-collapse",
              weekdays: "border-b border-[#E7EFEB]",
              weekday: "h-9 text-center text-[11px] font-semibold uppercase text-[#6F817A]",
              week: "h-10",
              day: "p-0 text-center",
              day_button:
                "mx-auto flex size-9 items-center justify-center border border-transparent text-sm font-medium transition-colors hover:border-[#B9D9CF] hover:bg-[#E6F3EE] focus:outline-none focus:ring-2 focus:ring-[#2A6A5D]/30",
              selected: "bg-[#2A6A5D] text-white",
              today: "text-[#0F766E]",
              disabled: "text-[#B7C4BF] line-through opacity-60",
              outside: "text-[#B7C4BF]",
            }}
          />
          <p className="mt-3 text-xs text-[#6F817A]">
            Domingos sin atención. Los sábados atendemos hasta las 16:30.
          </p>
        </div>
      </section>

      <section className="border border-[#DCE8E2] bg-[#FCFDFC]">
        <div className="border-b border-[#E7EFEB] px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Elige un horario
          </p>
          <p className="mt-1 text-sm font-medium capitalize text-[#1D3A35]">
            {getDayName(selectedDate)}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {showInitialLoading ? (
          <div
            className="grid min-h-24 grid-cols-3 gap-2"
            aria-label="Actualizando horarios"
          >
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="h-11 animate-pulse border border-[#DCE8E2] bg-[#F0F8F5]"
              />
            ))}
          </div>
        ) : closed ? (
          <div className="flex min-h-36 items-center border border-dashed border-[#B9D9CF] bg-[#F7FAF9] px-4 text-sm text-[#5C6F68]">
            No atendemos los {getDayName(selectedDate)}.
          </div>
        ) : slots.length === 0 ? (
          <div className="flex min-h-36 items-center border border-dashed border-[#B9D9CF] bg-[#F7FAF9] px-4 text-sm text-[#5C6F68]">
            No hay horarios disponibles para este día.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={loading || !slot.available}
                onClick={() => handleSlot(slot.time)}
                className={`
                  min-h-11 border px-2 py-2 text-sm font-semibold transition-colors
                  ${
                    loading
                      ? "cursor-wait border-[#DCE8E2] bg-[#F7FAF9] text-[#8A9B95] opacity-50"
                      : !slot.available
                        ? "cursor-not-allowed border-[#E2E8E5] bg-[#F7FAF9] text-[#AAB9B3] opacity-60"
                        : selectedTime === slot.time
                          ? "border-[#2A6A5D] bg-[#2A6A5D] text-white"
                          : "border-[#DCE8E2] bg-white text-[#1D3A35] hover:border-[#79A99C] hover:bg-[#F0F8F5]"
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
