"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createReservationAction } from "../actions/create-reservation.action";
import {
  ReservationSchema,
  type ReservationFormData,
} from "../schemas/reservation.schema";
import type { Service } from "@/generated/prisma/client";
import type { PetSpecies } from "@/generated/prisma/enums";
import FormErrors from "@/shared/ui/FormErrors";
import { formatDayMonthYearDateTime } from "@/utils/dateFormatters";
import CustomerDetails from "./CustomerDetails";
import SlotPicker from "./SlotPicker";
import { getRequiredProfessionalRole, type ProfessionalRole } from "../serviceRoles";
import { confirmSwal, swalSummaryHtml } from "@/shared/utils/sweetAlert";

type Props = {
  services: Array<Service & { category?: { slug: string; name: string } | null }>;
  professionals: Array<{
    id: string;
    name: string;
    role: ProfessionalRole;
    serviceIds: string[];
  }>;
  defaultServiceId?: string;
  defaultProfessionalId?: string;
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

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

const PROFESSIONAL_ROLE_LABELS: Record<ProfessionalRole, string> = {
  VETERINARY: "veterinaria",
  GROOMING: "peluquería y baño",
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
  defaultProfessionalId,
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
      professionalId: defaultProfessionalId,
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
  const requestedProfessionalId = variant === "admin"
    ? undefined
    : searchParams.get("profesional") ?? defaultProfessionalId;
  const requestedProfessional = professionals.find(
    (professional) => professional.id === requestedProfessionalId,
  );
  const requestedProfessionalServiceIds = requestedProfessional?.serviceIds ?? [];
  const requiredProfessionalRole = selectedService
    ? getRequiredProfessionalRole(selectedService.slug, selectedService.category?.slug)
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
  const requestedProfessionalIsAvailable = requestedProfessionalId
    ? availableProfessionals.some((professional) => professional.id === requestedProfessionalId)
    : false;
  const servicesForSelect = requestedProfessional
    ? services.filter((service) => requestedProfessional.serviceIds.includes(service.id))
    : services;
  const servicesByCategory = servicesForSelect.reduce<
    Array<{ label: string; services: typeof services }>
  >((groups, service) => {
    const label = service.category?.name ?? "Otros servicios";
    const currentGroup = groups.find((group) => group.label === label);

    if (currentGroup) {
      currentGroup.services.push(service);
      return groups;
    }

    groups.push({ label, services: [service] });
    return groups;
  }, []);

  function syncServiceUrl(nextServiceId: string) {
    if (variant === "admin") return;

    const nextService = services.find((service) => service.id === nextServiceId);
    const params = new URLSearchParams(searchParams.toString());
    const canKeepRequestedProfessional = requestedProfessionalServiceIds.includes(nextServiceId);

    params.delete("serviceId");
    params.delete("profesional");

    if (nextService) {
      params.set("servicio", nextService.slug);
    } else {
      params.delete("servicio");
    }

    if (requestedProfessionalId && canKeepRequestedProfessional) {
      params.set("profesional", requestedProfessionalId);
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  useEffect(() => {
    const selectedServiceIsAvailable = services.some(
      (service) => service.id === serviceId,
    );

    if (serviceId && !selectedServiceIsAvailable) {
      setValue("serviceId", "");
      setValue("professionalId", undefined);
      setValue("startAt", "");
      if (variant !== "admin") {
        router.replace(pathname, { scroll: false });
      }
    }
  }, [pathname, router, serviceId, services, setValue, variant]);

  useEffect(() => {
    if (!selectedProfessionalIsAvailable) {
      setValue("professionalId", undefined);
      setValue("startAt", "");
    }
  }, [selectedProfessionalIsAvailable, setValue]);

  useEffect(() => {
    if (requestedProfessionalId && requestedProfessionalIsAvailable) {
      setValue("professionalId", requestedProfessionalId, { shouldDirty: false });
    }
  }, [requestedProfessionalId, requestedProfessionalIsAvailable, setValue]);

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
            const nextProfessionalId = requestedProfessional && requestedProfessionalServiceIds.includes(nextServiceId)
              ? requestedProfessional.id
              : undefined;
            setValue("serviceId", nextServiceId);
            setValue("professionalId", nextProfessionalId);
            setValue("startAt", "");
            syncServiceUrl(nextServiceId);
          }}
          className={inputClassName}
        >
          <option value="">Selecciona un servicio</option>
          {servicesByCategory.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price.toLocaleString("es-CL")} ({formatDuration(service.durationMin)})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedService && requiredProfessionalRole && (
          <div className="mt-3 rounded-xl border border-[#DCE8E2] bg-[#F7FAF9] px-4 py-3 text-sm text-[#5C6F68]">
            <p className="font-semibold text-[#1D3A35]">{selectedService.name}</p>
            <p className="mt-1">
              {formatDuration(selectedService.durationMin)} · {currencyFormatter.format(selectedService.price)} · Atención de {PROFESSIONAL_ROLE_LABELS[requiredProfessionalRole]}
            </p>
            {selectedProfessional && (
              <p className="mt-1 font-medium text-[#1D3A35]">
                Profesional: {selectedProfessional.name}
              </p>
            )}
          </div>
        )}
        {errors.serviceId && <FormErrors>{errors.serviceId.message}</FormErrors>}
        {serviceId && !hasAvailableProfessionals && (
          <FormErrors>No hay profesionales activos de {requiredProfessionalRole ? PROFESSIONAL_ROLE_LABELS[requiredProfessionalRole] : "este tipo"} asignados a este servicio.</FormErrors>
        )}
      </div>

      {serviceId && availableProfessionals.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Profesional {requiredProfessionalRole ? `(${PROFESSIONAL_ROLE_LABELS[requiredProfessionalRole]}, opcional)` : "(opcional)"}
          </label>
          <select
            {...register("professionalId")}
            value={professionalId ?? ""}
            onChange={(event) => {
              setValue("professionalId", event.currentTarget.value || undefined, { shouldDirty: true });
              setValue("startAt", "");
            }}
            className={inputClassName}
          >
            <option value="">Cualquier profesional disponible</option>
            {availableProfessionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-5 text-[#6F817A]">
            Si no eliges uno, asignaremos automáticamente el primer horario disponible entre profesionales compatibles.
          </p>
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
