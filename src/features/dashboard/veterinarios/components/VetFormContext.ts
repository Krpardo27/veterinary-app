"use client";

import { createContext, useContext } from "react";
import type { ProfessionalService, Professional, Service } from "@/generated/prisma/client";
import type { VetActionState } from "../actions/veterinarios-actions";

export type VetFormContextValue = {
  vet?: Professional & {
    services?: Pick<ProfessionalService, "serviceId" | "durationMin" | "isActive">[];
    _count?: { reservations: number };
  };
  services: Array<Pick<Service, "id" | "name" | "slug" | "durationMin"> & { category?: { slug: string } | null }>;
  state: VetActionState;
  isPending: boolean;
  formKey?: string;
  onSubmit: (formData: FormData) => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
};

export const VetFormContext = createContext<VetFormContextValue | null>(null);

export function useVetForm() {
  const ctx = useContext(VetFormContext);
  if (!ctx) throw new Error("useVetForm must be used inside AddVetForm or EditVetForm");
  return ctx;
}
