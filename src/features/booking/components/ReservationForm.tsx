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
import type { PetSpecies } from "@/generated/prisma/enums";
import FormErrors from "@/features/admin/components/FormErrors";
import { formatDayMonthYearDateTime } from "@/utils/dateFormatters";
import CustomerDetails from "./CustomerDetails";
import SlotPicker from "./SlotPicker";
import { getRequiredProfessionalRole, type ProfessionalRole } from "../serviceRoles";
import { confirmSwal, swalSummaryHtml } from "@/shared/utils/sweetAlert";

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

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const PET_SPECIES_LABELS: Record<PetSpecies, string> = {
  DOG: "Perro",
  CAT: "Gato",
  BIRD: "Ave",
  OTHER: "Otro",
};

type CustomerPet = {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
};

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
  const [customerPets, setCustomerPets] = useState<CustomerPet[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: {
      serviceId: defaultServiceId ?? "",
      customerMode: variant === "admin" ? "search" : "new",
      petId: "",
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
  const customerId = useWatch({ control, name: "customerId" });
  const customerName = useWatch({ control, name: "customerName" });
  const petId = useWatch({ control, name: "petId" });
  const petName = useWatch({ control, name: "petName" });
  const selectedService = services.find((service) => service.id === serviceId);
  const selectedProfessional = professionals.find(
    (professional) => professional.id === professionalId,
  );
  const requiredProfessionalRole = selectedService
    ? getRequiredProfessionalRole(selectedService.slug)
    : null;
  const availableProfessionals = professionals.filter(
    (professional) =>
      professional.serviceIds.includes(serviceId) &&
      professional.role === requiredProfessionalRole,
  );
  const hasAvailableProfessionals = !serviceId || availableProfessionals.length > 0;
  const selectedProfessionalIsAvailable = professionalId
    ? availableProfessionals.some((professional) => professional.id === professionalId)
    : true;

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

  useEffect(() => {
    if (!selectedProfessionalIsAvailable) {
      setValue("professionalId", undefined);
      setValue("startAt", "");
    }
  }, [selectedProfessionalIsAvailable, setValue]);

  const onSubmit = async (data: ReservationFormData) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setServerError(null);

    const service = services.find((item) => item.id === data.serviceId);
    const pet = data.petId
      ? customerPets.find((item) => item.id === data.petId)?.name
      : data.petName;
    const professional = data.professionalId
      ? professionals.find((item) => item.id === data.professionalId)?.name
      : "Cualquier profesional disponible";

    const confirmation = await confirmSwal({
      title: "Confirmar reserva",
      html: swalSummaryHtml(
        [
          { label: "Servicio", value: service?.name },
          { label: "Fecha", value: data.startAt ? formatDayMonthYearDateTime(new Date(data.startAt)) : null },
          { label: "Profesional", value: professional },
          { label: "Dueño", value: data.customerName },
          { label: "Mascota", value: pet },
        ],
        { label: "Total", value: service ? currencyFormatter.format(service.price) : "-" },
      ),
      confirmButtonText: "Confirmar reserva",
      cancelButtonText: "Revisar datos",
    });

    if (!confirmation.isConfirmed) {
      setIsProcessing(false);
      return;
    }

    const result = await createReservationAction(data);

    if (result.errors) {
      setIsProcessing(false);
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
        {serviceId && !hasAvailableProfessionals && (
          <FormErrors>No hay profesionales activos asignados a este servicio.</FormErrors>
        )}
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

      {serviceId && hasAvailableProfessionals && (
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

      <CustomerDetails
        form={form}
        enableLookup={variant === "admin"}
        onCustomerSelected={(customer) => {
          setCustomerPets(customer?.pets ?? []);
          setValue("petId", "");
          setValue("petName", "");
          setValue("petBreed", "");
        }}
      />

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Datos de la mascota
        </p>

        {customerId && customerPets.length > 0 && (
          <div className="mb-4">
            <label htmlFor="pet-id" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
              Mascota registrada
            </label>
            <select
              id="pet-id"
              {...register("petId", {
                onChange: (event) => {
                  if (event.target.value) {
                    setValue("petName", "");
                    setValue("petBreed", "");
                  }
                },
              })}
              className={inputClassName}
            >
              <option value="">Registrar una nueva mascota</option>
              {customerPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} - {PET_SPECIES_LABELS[pet.species]}{pet.breed ? `, ${pet.breed}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {!petId && <div className="grid gap-4 sm:grid-cols-2">
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
              <option value="BIRD">Ave</option>
              <option value="OTHER">Otro</option>
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
        </div>}
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
          <p className="text-xs text-[#5C6F68]">
            Profesional: {selectedProfessional?.name ?? "Cualquier profesional disponible"}
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
            {currencyFormatter.format(selectedService.price)}
          </p>
        </div>
      )}

      {serverError && <FormErrors>{serverError}</FormErrors>}

      <button
        type="submit"
        disabled={isSubmitting || isProcessing}
        className="w-full cursor-pointer bg-[#2A6A5D] py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1D554A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting || isProcessing ? "Reservando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
