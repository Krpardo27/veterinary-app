"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createReservationAction } from "../actions/create-reservation.action";
import {
  ReservationSchema,
  type ReservationFormData,
} from "../schemas/reservation.schema";
import type { Service } from "@/generated/prisma/client";
import FormErrors from "@/features/admin/components/FormErrors";
import { formatDayMonthYearDateTime } from "@/utils/dateFormatters";
import CustomerDetails from "./CustomerDetails";
import SlotPicker from "./SlotPicker";
import { getRequiredProfessionalRole, type ProfessionalRole } from "../serviceRoles";

type Props = {
  services: Service[];
  professionals: Array<{
    id: string;
    name: string;
    role: ProfessionalRole;
    serviceIds: string[];
  }>;
  defaultServiceId?: string;
  variant?: "public" | "admin";
  onSuccess?: () => void;
};

const inputClassName =
  "w-full border border-[#DCE8E2] bg-[#FCFDFC] px-4 py-3 text-sm text-[#1D3A35] transition-colors outline-none placeholder:text-[#8A9B95] focus:border-[#2A6A5D] focus:ring-2 focus:ring-[#2A6A5D]/10";

export default function ReservationForm({
  services,
  professionals,
  defaultServiceId,
  variant = "public",
  onSuccess,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: {
      serviceId: defaultServiceId ?? "",
      customerMode: "search",
      petName: "",
      petSpecies: "DOG",
      petBreed: "",
    },
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const serviceId = useWatch({ control, name: "serviceId" });
  const professionalId = useWatch({ control, name: "professionalId" });
  const startAt = useWatch({ control, name: "startAt" });
  const customerName = useWatch({ control, name: "customerName" });
  const petName = useWatch({ control, name: "petName" });
  const selectedService = services.find((service) => service.id === serviceId);
  const requiredProfessionalRole = selectedService
    ? getRequiredProfessionalRole(selectedService.slug)
    : null;
  const availableProfessionals = professionals.filter(
    (professional) =>
      professional.serviceIds.includes(serviceId) &&
      professional.role === requiredProfessionalRole,
  );

  const syncServiceUrl = useCallback(
    (nextServiceId: string) => {
      if (variant === "admin") return;

      const nextService = services.find((service) => service.id === nextServiceId);
      const params = new URLSearchParams(searchParams.toString());

      params.delete("serviceId");

      if (nextService) {
        params.set("servicio", nextService.slug);
      } else {
        params.delete("servicio");
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams, services, variant],
  );

  useEffect(() => {
    const selectedServiceIsAvailable = services.some(
      (service) => service.id === serviceId,
    );

    if (serviceId && !selectedServiceIsAvailable) {
      setValue("serviceId", "");
      setValue("professionalId", undefined);
      setValue("startAt", "");
      syncServiceUrl("");
    }
  }, [serviceId, services, setValue, syncServiceUrl]);

  const onSubmit = async (data: ReservationFormData) => {
    setServerError(null);

    const result = await createReservationAction(data);

    if (result.errors) {
      setServerError(result.errors[0]?.message ?? "Error desconocido");
      return;
    }

    if (variant === "admin") {
      onSuccess?.();
      router.refresh();
      return;
    }

    const params = new URLSearchParams({ id: result.data!.reservationId });
    router.push(`/reservar/confirmacion?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Servicio
        </label>
        <select
          {...register("serviceId")}
          onChange={(event) => {
            const nextServiceId = event.target.value;
            setValue("serviceId", nextServiceId);
            setValue("professionalId", undefined);
            setValue("startAt", "");
            syncServiceUrl(nextServiceId);
          }}
          className={inputClassName}
        >
          <option value="">Selecciona un servicio</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.price.toLocaleString("es-CL")} ({service.durationMin} min)
            </option>
          ))}
        </select>
        {errors.serviceId && <FormErrors>{errors.serviceId.message}</FormErrors>}
      </div>

      {serviceId && availableProfessionals.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Profesional (opcional)
          </label>
          <select
            {...register("professionalId", {
              onChange: () => setValue("startAt", ""),
            })}
            className={inputClassName}
          >
            <option value="">Cualquier profesional disponible</option>
            {availableProfessionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {serviceId && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Fecha y hora
          </label>
          <SlotPicker
            serviceId={serviceId}
            professionalId={professionalId || undefined}
            value={startAt ?? ""}
            onChange={(iso) => setValue("startAt", iso)}
          />
        </div>
      )}
      {serviceId && errors.startAt && <FormErrors>{errors.startAt.message}</FormErrors>}

      <CustomerDetails form={form} />

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Datos de la mascota
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pet-name" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
              Nombre
            </label>
            <input
              id="pet-name"
              type="text"
              placeholder="Luna"
              {...register("petName")}
              className={inputClassName}
            />
            {errors.petName && <FormErrors>{errors.petName.message}</FormErrors>}
          </div>

          <div>
            <label htmlFor="pet-species" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
              Especie
            </label>
            <select id="pet-species" {...register("petSpecies")} className={inputClassName}>
              <option value="DOG">Perro</option>
              <option value="CAT">Gato</option>
            </select>
            {errors.petSpecies && <FormErrors>{errors.petSpecies.message}</FormErrors>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="pet-breed" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
              Raza (opcional)
            </label>
            <input
              id="pet-breed"
              type="text"
              placeholder="Mestizo"
              {...register("petBreed")}
              className={inputClassName}
            />
            {errors.petBreed && <FormErrors>{errors.petBreed.message}</FormErrors>}
          </div>
        </div>
      </section>

      <div>
        <label htmlFor="notes" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Motivo de la consulta / notas
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={4}
          placeholder="Cuéntanos brevemente el motivo de la consulta o alguna indicación importante..."
          className={`${inputClassName} resize-none`}
        />
      </div>

      {selectedService && startAt && (
        <div className="space-y-1 border border-[#B9D9CF] bg-[#F0F8F5] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Resumen de la reserva
          </p>
          <p className="text-sm font-medium text-[#1D3A35]">{selectedService.name}</p>
          <p className="text-xs text-[#5C6F68]">
            Duración: {selectedService.durationMin} minutos
          </p>
          {selectedService.description && (
            <p className="text-sm text-[#5C6F68]">{selectedService.description}</p>
          )}
          {customerName?.trim() && (
            <p className="text-sm text-[#1D3A35]">
              Dueño: <span className="font-semibold">{customerName}</span>
            </p>
          )}
          {petName?.trim() && (
            <p className="text-sm text-[#1D3A35]">
              Mascota: <span className="font-semibold">{petName}</span>
            </p>
          )}
          <p className="text-xs text-[#5C6F68]">
            {formatDayMonthYearDateTime(new Date(startAt))}
          </p>
          <p className="text-sm font-semibold text-[#0F766E]">
            ${selectedService.price.toLocaleString("es-CL")}
          </p>
        </div>
      )}

      {serverError && <FormErrors>{serverError}</FormErrors>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-[#2A6A5D] py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1D554A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Reservando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
