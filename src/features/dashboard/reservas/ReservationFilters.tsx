"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type ReservationFiltersProps = {
  date: string;
  serviceId: string;
  services: Array<{ id: string; name: string }>;
};

function buildUrl(date: string, serviceId: string, query: string | null) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (date) params.set("date", date);
  if (serviceId) params.set("serviceId", serviceId);
  const search = params.toString();
  return search ? `/admin/reservas?${search}` : "/admin/reservas";
}

export default function ReservationFilters({
  date,
  serviceId,
  services,
}: ReservationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [localDate, setLocalDate] = useState(date);
  const [localServiceId, setLocalServiceId] = useState(serviceId);

  function applyFilters(nextDate = localDate, nextServiceId = localServiceId) {
    router.replace(buildUrl(nextDate, nextServiceId, query));
  }

  function handleClear() {
    setLocalDate("");
    setLocalServiceId("");
    router.replace(
      query
        ? `/admin/reservas?q=${encodeURIComponent(query)}`
        : "/admin/reservas",
    );
  }

  return (
    <form
      action={() => applyFilters()}
      className="flex flex-wrap items-end gap-3"
    >
      <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700">
        Fecha
        <input
          type="date"
          name="date"
          value={localDate}
          onChange={(e) => {
            setLocalDate(e.target.value);
            applyFilters(e.target.value, localServiceId);
          }}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700">
        Servicio
        <select
          name="serviceId"
          value={localServiceId}
          onChange={(e) => {
            setLocalServiceId(e.target.value);
            applyFilters(localDate, e.target.value);
          }}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
        >
          <option value="">Todos los servicios</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      {(localDate || localServiceId) && (
        <button
          type="button"
          onClick={handleClear}
          className="h-10 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          Limpiar filtros
        </button>
      )}
    </form>
  );
}
