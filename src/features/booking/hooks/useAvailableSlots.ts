"use client";

import { useEffect, useState } from "react";

export type Slot = {
  time: string;
  available: boolean;
};

export function useAvailableSlots(serviceId: string, date: string, veterinarianId?: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!serviceId || !date) return;

    const controller = new AbortController();

    async function fetchSlots() {
      setLoading(true);
      setClosed(false);
      let retries = 0;
      const maxRetries = 3;

      async function attemptFetch(): Promise<void> {
        try {
          const params = new URLSearchParams({ serviceId, date });

          if (veterinarianId) {
            params.set("veterinarianId", veterinarianId);
          }

          const res = await fetch(`/api/slots?${params.toString()}`, {
            signal: controller.signal,
          });

          // Reintentar en caso de 404 o 500 (puede ser compilación)
          if (!res.ok && (res.status === 404 || res.status === 500) && retries < maxRetries) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 500 * retries)); // backoff exponencial
            return attemptFetch();
          }

          if (!res.ok) {
            setSlots([]);
            return;
          }

          const data = await res.json();
          setSlots(data.slots ?? []);
          setClosed(data.closed === true);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          
          // Reintentar en caso de error de red
          if (retries < maxRetries) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 500 * retries));
            return attemptFetch();
          }
          
          setSlots([]);
        }
      }

      try {
        await attemptFetch();
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchSlots();

    return () => controller.abort();
  }, [serviceId, date, veterinarianId]);

  return { slots, loading, closed };
}