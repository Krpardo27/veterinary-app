"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type ReservationFiltersProps = {
  date: string;
  serviceId: string;
  showCancelled: boolean;
  services: Array<{ id: string; name: string }>;
};

function buildUrl(currentParams: URLSearchParams, date: string, serviceId: string, showCancelled: boolean) {
  const params = new URLSearchParams(currentParams.toString());
  params.delete("page");
  if (date) params.set("date", date);
  else params.delete("date");
  if (serviceId) params.set("serviceId", serviceId);
  else params.delete("serviceId");
  if (showCancelled) params.set("showCancelled", "true");
  else params.delete("showCancelled");
  const search = params.toString();
  return search ? `/admin/reservas?${search}` : "/admin/reservas";
}

export default function ReservationFilters({
  date,
  serviceId,
  showCancelled,
  services,
}: ReservationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localDate, setLocalDate] = useState(date);
  const [localServiceId, setLocalServiceId] = useState(serviceId);
  const [localShowCancelled, setLocalShowCancelled] = useState(showCancelled);

  function applyFilters(nextDate = localDate, nextServiceId = localServiceId, nextShowCancelled = localShowCancelled) {
    router.replace(buildUrl(searchParams, nextDate, nextServiceId, nextShowCancelled), { scroll: false });
  }

  function handleClear() {
    setLocalDate("");
    setLocalServiceId("");
    setLocalShowCancelled(false);
    router.replace(buildUrl(searchParams, "", "", false), { scroll: false });
  }

  return (
    <form
      action={() => applyFilters()}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700">
        Fecha
        <input
          type="date"
          name="date"
          value={localDate}
          onChange={(e) => {
            setLocalDate(e.target.value);
            applyFilters(e.target.value, localServiceId, localShowCancelled);
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
            applyFilters(localDate, e.target.value, localShowCancelled);
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

      <label className="flex items-center gap-2 text-xs font-medium text-zinc-700">
        <input
          type="checkbox"
          checked={localShowCancelled}
          onChange={(e) => {
            setLocalShowCancelled(e.target.checked);
            applyFilters(localDate, localServiceId, e.target.checked);
          }}
          className="h-4 w-4 rounded border-zinc-300 text-[#0F766E] focus:ring-[#0F766E]/20"
        />
        Mostrar canceladas
      </label>

      {(localDate || localServiceId || localShowCancelled) && (
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
