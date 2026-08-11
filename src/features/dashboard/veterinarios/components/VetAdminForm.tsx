"use client";

import { useState } from "react";
import { FiCheckCircle, FiEdit3, FiPlus, FiSave, FiSlash, FiTrash2 } from "react-icons/fi";
import Form from "./Form";
import FormErrors from "./FormErrors";
import FormInput from "./FormInput";
import FormLabel from "./FormLabel";
import FormSelectServices from "./FormSelectServices";
import { useVetForm } from "./VetFormContext";

export default function VetAdminForm() {
  const { vet, services, state, isPending, formKey, onSubmit, onDeactivate, onDelete } = useVetForm();
  const editing = Boolean(vet);
  const hasReservations = (vet?._count?.reservations ?? 0) > 0;
  const errors = state.fieldErrors;
  const values = state.values;
  const [selectedRole, setSelectedRole] = useState(values?.role ?? vet?.role ?? "VETERINARY");

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "");
    let n = digits;
    if (n.startsWith("56")) n = n.slice(2);
    if (n.startsWith("9")) n = n.slice(1);
    return `+569${n.slice(0, 8)}`;
  }

  return (
    <Form
      key={formKey}
      noValidate
      action={onSubmit}
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-zinc-100 bg-[#0F766E]/5 px-5 py-5 pr-16 sm:px-7">
        <div>
          <div className="flex items-center gap-2 text-[#0F766E]">
            {editing ? <FiEdit3 className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]">
              {editing ? "Equipo" : "Nuevo perfil"}
            </p>
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            {editing ? "Editar profesional" : "Crear profesional"}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Define el rol, los datos y los servicios que puede atender.
          </p>
        </div>
        {vet?.isActive && (
          <span className="mt-1 rounded-full border border-[#0F766E]/20 bg-[#0F766E]/10 px-3 py-1 text-xs font-medium text-[#0F766E]">
            Activo
          </span>
        )}
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel htmlFor="name">Nombre</FormLabel>
            <FormInput id="name" name="name" defaultValue={values?.name ?? vet?.name ?? ""} minLength={2}
              error={!!errors?.name?.[0]} />
            {errors?.name?.[0] && <FormErrors>{errors.name[0]}</FormErrors>}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="phone">Teléfono</FormLabel>
            <FormInput id="phone" name="phone" type="tel" placeholder="+56912345678" maxLength={12}
              defaultValue={values?.phone ?? vet?.phone ?? "+569"}
              error={!!errors?.phone?.[0]}
              onChange={(e) => { e.currentTarget.value = formatPhone(e.currentTarget.value); }}
              onKeyDown={(e) => {
                const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault();
              }} />
            {errors?.phone?.[0] && <FormErrors>{errors.phone[0]}</FormErrors>}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput id="email" name="email" type="email" defaultValue={values?.email ?? vet?.email ?? ""}
              error={!!errors?.email?.[0]} />
            {errors?.email?.[0] && <FormErrors>{errors.email[0]}</FormErrors>}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="role">Rol</FormLabel>
            <select
              id="role"
              name="role"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.currentTarget.value as typeof selectedRole)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
            >
              <option value="VETERINARY">Veterinario/a</option>
              <option value="GROOMING">Peluquería y baño</option>
            </select>
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="imageUrl">Imagen URL</FormLabel>
            <FormInput id="imageUrl" name="imageUrl" defaultValue={values?.imageUrl ?? vet?.imageUrl ?? ""}
              error={!!errors?.imageUrl?.[0]} />
            {errors?.imageUrl?.[0] && <FormErrors>{errors.imageUrl[0]}</FormErrors>}
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="bio">Biografía</FormLabel>
          <textarea id="bio" name="bio" defaultValue={values?.bio ?? vet?.bio ?? ""} rows={4}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20" />
          {errors?.bio?.[0] && <FormErrors>{errors.bio[0]}</FormErrors>}
        </div>

        <FormSelectServices
          services={services}
          assignments={vet?.services}
          submittedValues={values?.services}
          selectedRole={selectedRole}
        />

        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100">
              <input name="isActive" type="checkbox" defaultChecked={values?.isActive ?? vet?.isActive ?? true} className="h-4 w-4 accent-[#0F766E]" />
              Activo
            </label>
            {state.message && (
              <p className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${state.status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}>
                {state.status === "success" && <FiCheckCircle className="h-4 w-4" />}
                {state.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
            {vet?.isActive && onDeactivate && (
              <button type="button" onClick={onDeactivate} disabled={isPending}
                className="inline-flex h-11 cursor-pointer w-full items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 text-xs font-bold uppercase tracking-wide text-orange-600 transition-colors hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                <FiSlash className="h-4 w-4" />
                Desactivar
              </button>
            )}
            {vet && onDelete && !hasReservations && (
              <button type="button" onClick={onDelete} disabled={isPending}
                className="inline-flex h-11 cursor-pointer w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-xs font-bold uppercase tracking-wide text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                <FiTrash2 className="h-4 w-4" />
                Eliminar
              </button>
            )}
            <button type="submit" disabled={isPending}
              className="inline-flex h-11 cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              {editing ? <FiSave className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
              {isPending ? "Guardando..." : editing ? "Guardar" : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
}
