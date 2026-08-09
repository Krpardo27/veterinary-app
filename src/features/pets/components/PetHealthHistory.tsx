"use client";

import { useState, useTransition } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "sonner";

import FormErrors from "@/features/admin/components/FormErrors";
import {
  deleteWeightRecordAction,
  updateWeightRecordAction,
} from "../actions/weight-record.actions";
import {
  deleteVaccinationRecordAction,
  updateVaccinationRecordAction,
} from "../actions/vaccination-record.actions";
import type { PetHealthActionState } from "../actions/pet-health.shared";

type WeightRecord = {
  id: string;
  weight: number;
  measuredAt: Date;
  notes: string | null;
};

type VaccinationRecord = {
  id: string;
  vaccineName: string;
  appliedAt: Date;
  nextDueAt: Date | null;
  notes: string | null;
};

type Props = {
  petId: string;
  weightRecords: WeightRecord[];
  vaccinations: VaccinationRecord[];
};

const initialState: PetHealthActionState = { status: "idle", message: "" };
const inputClassName =
  "w-full border border-[#DCE8E2] bg-white px-3 py-2 text-sm text-[#1D3A35] outline-none focus:border-[#2A6A5D] focus:ring-2 focus:ring-[#2A6A5D]/10";

function dateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

function shortDate(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(
    new Date(date),
  );
}

function WeightRecordRow({
  petId,
  record,
}: {
  petId: string;
  record: WeightRecord;
}) {
  const [editing, setEditing] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [isSaving, startSave] = useTransition();
  const [state, setState] = useState(initialState);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Eliminar control de peso",
      text: `Se eliminará el registro de ${record.weight} kg.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    startDelete(async () => {
      const response = await deleteWeightRecordAction(petId, record.id);
      if (response.status === "success") toast.success(response.message);
      else toast.error(response.message);
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const weight = formData.get("weight")?.toString() ?? "";
    const measuredAt = formData.get("measuredAt")?.toString() ?? "";
    const notes = formData.get("notes")?.toString().trim() ?? "";

    if (
      weight === String(record.weight) &&
      measuredAt === dateInputValue(record.measuredAt) &&
      notes === (record.notes ?? "")
    ) {
      toast.info("No se detectaron cambios");
      return;
    }

    const result = await Swal.fire({
      title: "Guardar cambios",
      text: "Se actualizará este control de peso.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0F766E",
    });
    if (!result.isConfirmed) return;

    startSave(async () => {
      const response = await updateWeightRecordAction(
        petId,
        record.id,
        state,
        formData,
      );
      setState(response);

      if (response.status === "success") {
        toast.success(response.message);
        setEditing(false);
      } else {
        toast.error(response.message);
      }
    });
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-4 py-3 text-sm">
        <div>
          <p className="font-semibold text-[#1D3A35]">{record.weight} kg</p>
          {record.notes && (
            <p className="mt-1 text-xs text-[#6F817A]">{record.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-[#5C6F68]">
            {shortDate(record.measuredAt)}
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 text-[#0F766E] hover:bg-[#EAF4F1]"
            aria-label="Editar peso"
          >
            <FiEdit3 />
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
            aria-label="Eliminar peso"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-2 bg-[#F7FAF9] py-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          name="weight"
          type="number"
          min="0.1"
          step="0.1"
          defaultValue={record.weight}
          required
          className={inputClassName}
        />
        <input
          name="measuredAt"
          type="date"
          defaultValue={dateInputValue(record.measuredAt)}
          required
          className={inputClassName}
        />
        <input
          name="notes"
          defaultValue={record.notes ?? ""}
          placeholder="Notas"
          className={inputClassName}
        />
      </div>
      {state.fieldErrors?.weight?.[0] && (
        <FormErrors>{state.fieldErrors.weight[0]}</FormErrors>
      )}
      {state.fieldErrors?.measuredAt?.[0] && (
        <FormErrors>{state.fieldErrors.measuredAt[0]}</FormErrors>
      )}
      {state.fieldErrors?.notes?.[0] && (
        <FormErrors>{state.fieldErrors.notes[0]}</FormErrors>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#2A6A5D] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="border border-[#B9D9CF] px-3 py-2 text-xs font-semibold text-[#1D554A]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function VaccinationRecordRow({
  petId,
  record,
}: {
  petId: string;
  record: VaccinationRecord;
}) {
  const [editing, setEditing] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [isSaving, startSave] = useTransition();
  const [state, setState] = useState(initialState);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Eliminar vacuna",
      text: `Se eliminará ${record.vaccineName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    startDelete(async () => {
      const response = await deleteVaccinationRecordAction(petId, record.id);
      if (response.status === "success") toast.success(response.message);
      else toast.error(response.message);
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const vaccineName = formData.get("vaccineName")?.toString().trim() ?? "";
    const appliedAt = formData.get("appliedAt")?.toString() ?? "";
    const nextDueAt = formData.get("nextDueAt")?.toString() ?? "";
    const notes = formData.get("notes")?.toString().trim() ?? "";

    if (
      vaccineName === record.vaccineName &&
      appliedAt === dateInputValue(record.appliedAt) &&
      nextDueAt ===
        (record.nextDueAt ? dateInputValue(record.nextDueAt) : "") &&
      notes === (record.notes ?? "")
    ) {
      toast.info("No se detectaron cambios");
      return;
    }

    const result = await Swal.fire({
      title: "Guardar cambios",
      text: "Se actualizará este registro de vacuna.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0F766E",
    });
    if (!result.isConfirmed) return;

    startSave(async () => {
      const response = await updateVaccinationRecordAction(
        petId,
        record.id,
        state,
        formData,
      );
      setState(response);

      if (response.status === "success") {
        toast.success(response.message);
        setEditing(false);
      } else {
        toast.error(response.message);
      }
    });
  };

  if (!editing) {
    return (
      <div className="py-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-[#1D3A35]">{record.vaccineName}</p>
            {record.nextDueAt && (
              <p className="mt-1 text-xs text-[#0F766E]">
                Próxima dosis: {shortDate(record.nextDueAt)}
              </p>
            )}
            {record.notes && (
              <p className="mt-1 text-xs text-[#6F817A]">{record.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="shrink-0 text-xs text-[#5C6F68]">
              {shortDate(record.appliedAt)}
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 text-[#0F766E] hover:bg-[#EAF4F1]"
              aria-label="Editar vacuna"
            >
              <FiEdit3 />
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
              aria-label="Eliminar vacuna"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-2 bg-[#F7FAF9] py-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="vaccineName"
          defaultValue={record.vaccineName}
          required
          className={inputClassName}
        />
        <input
          name="appliedAt"
          type="date"
          defaultValue={dateInputValue(record.appliedAt)}
          required
          className={inputClassName}
        />
        <input
          name="nextDueAt"
          type="date"
          defaultValue={
            record.nextDueAt ? dateInputValue(record.nextDueAt) : ""
          }
          className={inputClassName}
        />
        <input
          name="notes"
          defaultValue={record.notes ?? ""}
          placeholder="Notas"
          className={inputClassName}
        />
      </div>
      {state.fieldErrors?.vaccineName?.[0] && (
        <FormErrors>{state.fieldErrors.vaccineName[0]}</FormErrors>
      )}
      {state.fieldErrors?.appliedAt?.[0] && (
        <FormErrors>{state.fieldErrors.appliedAt[0]}</FormErrors>
      )}
      {state.fieldErrors?.nextDueAt?.[0] && (
        <FormErrors>{state.fieldErrors.nextDueAt[0]}</FormErrors>
      )}
      {state.fieldErrors?.notes?.[0] && (
        <FormErrors>{state.fieldErrors.notes[0]}</FormErrors>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#2A6A5D] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="border border-[#B9D9CF] px-3 py-2 text-xs font-semibold text-[#1D554A]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function PetHealthHistory({
  petId,
  weightRecords,
  vaccinations,
}: Props) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#1D3A35]">
            Historial de peso
          </h3>
          <span className="text-xs font-semibold text-[#0F766E]">
            {weightRecords.length}
          </span>
        </div>
        {weightRecords.length === 0 ? (
          <p className="mt-3 text-sm text-[#6F817A]">
            Aún no hay controles de peso.
          </p>
        ) : (
          <div className="mt-3 max-h-96 divide-y divide-[#E7EFEB] overflow-y-auto overscroll-contain border border-[#E7EFEB]">
            <div className="sticky top-0 z-10 border-b border-[#E7EFEB] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[#52736A]">
              Más reciente primero
            </div>
            {weightRecords.map((record) => (
              <div key={record.id} className="px-3">
                <WeightRecordRow petId={petId} record={record} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#1D3A35]">Vacunas</h3>
          <span className="text-xs font-semibold text-[#0F766E]">
            {vaccinations.length}
          </span>
        </div>
        {vaccinations.length === 0 ? (
          <p className="mt-3 text-sm text-[#6F817A]">
            Aún no hay vacunas registradas.
          </p>
        ) : (
          <div className="mt-3 max-h-96 divide-y divide-[#E7EFEB] overflow-y-auto overscroll-contain border border-[#E7EFEB]">
            <div className="sticky top-0 z-10 border-b border-[#E7EFEB] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[#52736A]">
              Más reciente primero
            </div>
            {vaccinations.map((record) => (
              <div key={record.id} className="px-3">
                <VaccinationRecordRow petId={petId} record={record} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
