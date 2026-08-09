"use client";

import { useState } from "react";
import { FiSearch, FiCheck } from "react-icons/fi";
import clsx from "clsx";

type Service = {
  id: string;
  name: string;
  durationMin: number;
};

type ServiceAssignment = {
  serviceId: string;
  durationMin: number | null;
  isActive: boolean;
};

type Props = {
  services: Service[];
  assignments?: ServiceAssignment[];
  submittedValues?: Record<string, { isActive: boolean; durationMin: string }>;
};

export default function FormSelectServices({
  services,
  assignments = [],
  submittedValues,
}: Props) {
  const getInitialEnabled = (id: string) => {
    if (submittedValues) return submittedValues[id]?.isActive ?? false;
    return assignments.find((a) => a.serviceId === id)?.isActive ?? false;
  };

  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(services.map((s) => [s.id, getInitialEnabled(s.id)])),
  );

  const [query, setQuery] = useState("");

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedCount = Object.values(enabled).filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar servicio..."
          className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
        />
      </div>

      {/* Counter */}
      <p className="text-xs text-zinc-400">
        {selectedCount} de {services.length} servicios seleccionados
      </p>

      {/* Service list */}
      <div className="max-h-72 overflow-y-auto rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
        {filtered.length === 0 && (
          <p className="p-4 text-center text-sm text-zinc-400">Sin resultados</p>
        )}

        {filtered.map((service) => {
          const isEnabled = enabled[service.id] ?? false;

          return (
            <div key={service.id} className="flex flex-col gap-3 px-4 py-3">
              {/* Toggle row */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setEnabled((prev) => ({ ...prev, [service.id]: !prev[service.id] }))
                  }
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={clsx(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      isEnabled
                        ? "border-[#0F766E] bg-[#0F766E] text-white"
                        : "border-zinc-300 bg-white",
                    )}
                  >
                    {isEnabled && <FiCheck className="h-3 w-3" />}
                  </span>
                  <span className="text-sm font-medium text-zinc-900">{service.name}</span>
                </button>

                <span className="shrink-0 text-xs text-zinc-400">base {service.durationMin} min</span>
              </div>

              {/* Hidden input for FormData */}
              {isEnabled && (
                <input type="hidden" name={`serviceEnabled:${service.id}`} value="on" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

