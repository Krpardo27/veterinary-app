"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiEdit3, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "sonner";
import type { Category, Service } from "@/generated/prisma/client";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
} from "../actions/service-actions";
import type { ServiceActionState } from "../actions/service-actions";
import FormErrors from "@/features/dashboard/veterinarios/components/FormErrors";
import FormSelectCategory from "@/features/dashboard/veterinarios/components/FormSelectCategory";

type ServiceAdminFormProps = {
  categories: Pick<Category, "id" | "name">[];
  service?: Service;
  successRedirectHref?: string;
  onSuccess?: () => void;
};

const initialServiceActionState: ServiceActionState = {
  status: "idle",
  message: "",
};

function SubmitButton({ editing, pending }: { editing: boolean; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {editing ? <FiSave className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
      {pending ? "Guardando..." : editing ? "Guardar" : "Crear"}
    </button>
  );
}

function formValue(formData: FormData, name: string) {
  return formData.get(name)?.toString().trim() ?? "";
}

function serviceHasChanges(service: Service, formData: FormData) {
  const featured = formData.get("featured") === "on";
  const isActive = formData.get("isActive") === "on";

  return (
    formValue(formData, "name") !== service.name ||
    formValue(formData, "description") !== (service.description ?? "") ||
    Number(formValue(formData, "price")) !== service.price ||
    Number(formValue(formData, "durationMin")) !== service.durationMin ||
    formValue(formData, "categoryId") !== service.categoryId ||
    featured !== service.featured ||
    isActive !== service.isActive
  );
}

export default function ServiceAdminForm({
  categories,
  service,
  successRedirectHref,
  onSuccess,
}: ServiceAdminFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editing = Boolean(service);
  const action = service
    ? updateServiceAction.bind(null, service.id)
    : createServiceAction;
  const [state, formAction] = useActionState(action, initialServiceActionState);
  const errors = state.fieldErrors;

  const handleSubmit = async (formData: FormData) => {
    if (service && !serviceHasChanges(service, formData)) {
      toast.warning("No se detectaron cambios en el servicio");
      return;
    }

    const result = await Swal.fire({
      title: editing ? "Guardar cambios" : "Crear servicio",
      text: editing
        ? "Se actualizaran los datos de este servicio."
        : "Se creara un nuevo servicio en el catalogo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editing ? "Guardar cambios" : "Crear servicio",
      cancelButtonText: "Volver",
      confirmButtonColor: "#C8A96E",
      cancelButtonColor: "#3f3f46",
      background: "#18181b",
      color: "#f4f4f5",
    });

    if (!result.isConfirmed) {
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleDelete = async () => {
    if (!service) {
      return;
    }

    const result = await Swal.fire({
      title: "Eliminar servicio",
      text: `Esta accion eliminara ${service.name} del catalogo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar servicio",
      cancelButtonText: "Volver",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46",
      background: "#18181b",
      color: "#f4f4f5",
    });

    if (!result.isConfirmed) {
      return;
    }

    startTransition(async () => {
      const response = await deleteServiceAction(service.id);

      if (response.status === "success") {
        toast.success(response.message);
        router.push(successRedirectHref ?? "/admin/servicios");
        return;
      }

      toast.error(response.message);
    });
  };

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);

      if (successRedirectHref) {
        router.push(successRedirectHref);
      } else {
        router.refresh();
      }

      onSuccess?.();

      return;
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [onSuccess, router, state.message, state.status, successRedirectHref]);

  return (
    <form
      noValidate
      action={handleSubmit}
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-zinc-100 bg-[#0F766E]/5 px-5 py-5 pr-16 sm:px-7">
        <div>
          <div className="flex items-center gap-2 text-[#0F766E]">
            {editing ? <FiEdit3 className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]">
              {editing ? "Catálogo" : "Nuevo servicio"}
            </p>
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            {editing ? "Editar servicio" : "Crear servicio"}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Define el precio, la duración, la categoría y el estado visible para reservas.
          </p>
        </div>

        {service?.featured && (
          <span className="mt-1 rounded-full border border-[#0F766E]/20 bg-[#0F766E]/10 px-3 py-1 text-xs font-medium text-[#0F766E]">
            Destacado
          </span>
        )}
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-zinc-700">
            <span>Nombre</span>
            <input
              name="name"
              defaultValue={service?.name ?? ""}
              minLength={2}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
            />
            {errors?.name?.[0] && <FormErrors>{errors.name[0]}</FormErrors>}
          </label>

          <label className="space-y-2 text-sm font-medium text-zinc-700">
            <span>Precio CLP</span>
            <input
              name="price"
              type="number"
              defaultValue={service?.price ?? ""}
              min={1000}
              step={500}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
            />
            {errors?.price?.[0] && <FormErrors>{errors.price[0]}</FormErrors>}
          </label>

          <label className="space-y-2 text-sm font-medium text-zinc-700">
            <span>Duración (minutos)</span>
            <input
              name="durationMin"
              type="number"
              defaultValue={service?.durationMin ?? ""}
              min={5}
              step={5}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
            />
            {errors?.durationMin?.[0] && <FormErrors>{errors.durationMin[0]}</FormErrors>}
          </label>

          <label className="space-y-2 text-sm font-medium text-zinc-700">
            <span>Categoría</span>
            {categories.length > 0 ? (
              <FormSelectCategory
                name="categoryId"
                defaultValue={service?.categoryId ?? ""}>
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </FormSelectCategory>
            ) : (
              <>
                <input type="hidden" name="categoryId" value="" />
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  No hay categorías disponibles. Crea una antes de agregar servicios.
                </div>
              </>
            )}
            {errors?.categoryId?.[0] && <FormErrors>{errors.categoryId[0]}</FormErrors>}
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-zinc-700">
          <span>Descripción</span>
          <textarea
            name="description"
            defaultValue={service?.description ?? ""}
            rows={4}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
          />
          {errors?.description?.[0] && <FormErrors>{errors.description[0]}</FormErrors>}
        </label>

        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors">
                <input name="featured" type="checkbox" defaultChecked={service?.featured ?? false} className="h-4 w-4 accent-[#0F766E]" />
                Destacado
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors">
                <input name="isActive" type="checkbox" defaultChecked={service?.isActive ?? true} className="h-4 w-4 accent-[#0F766E]" />
                Activo
              </label>
            </div>

            {state.message && (
              <p
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                  state.status === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {state.status === "success" && <FiCheckCircle className="h-4 w-4" />}
                {state.message}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
            {service && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex cursor-pointer h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-xs font-bold uppercase tracking-wide text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <FiTrash2 className="h-4 w-4" />
                Eliminar
              </button>
            )}

            <SubmitButton editing={editing} pending={isPending} />
          </div>
        </div>
      </div>
    </form>
  );
}
