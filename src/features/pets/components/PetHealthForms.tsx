"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { FiActivity } from "react-icons/fi";
import { FaSyringe } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "sonner";

import FormErrors from "@/features/admin/components/FormErrors";
import {
  createWeightRecordAction,
} from "../actions/weight-record.actions";
import { createVaccinationRecordAction } from "../actions/vaccination-record.actions";
import type { PetHealthActionState } from "../actions/pet-health.shared";

type Props = {
  petId: string;
};

const initialState: PetHealthActionState = {
  status: "idle",
  message: "",
};

const inputClassName =
  "w-full border border-[#DCE8E2] bg-[#FCFDFC] px-3 py-2.5 text-sm text-[#1D3A35] outline-none transition-colors focus:border-[#2A6A5D] focus:ring-2 focus:ring-[#2A6A5D]/10";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function PetHealthForms({ petId }: Props) {
  const [openForm, setOpenForm] = useState<"weight" | "vaccine" | null>(null);
  const [isWeightConfirming, startWeightTransition] = useTransition();
  const [isVaccineConfirming, startVaccineTransition] = useTransition();
  const [weightState, weightAction, isWeightPending] = useActionState(
    createWeightRecordAction.bind(null, petId),
    initialState,
  );
  const [vaccineState, vaccineAction, isVaccinePending] = useActionState(
    createVaccinationRecordAction.bind(null, petId),
    initialState,
  );

  useEffect(() => {
    if (!weightState.message) return;

    if (weightState.status === "success") {
      toast.success(weightState.message);
    } else if (weightState.status === "error") {
      toast.error(weightState.message);
    }
  }, [weightState.message, weightState.status]);

  useEffect(() => {
    if (!vaccineState.message) return;

    if (vaccineState.status === "success") {
      toast.success(vaccineState.message);
    } else if (vaccineState.status === "error") {
      toast.error(vaccineState.message);
    }
  }, [vaccineState.message, vaccineState.status]);

  const handleWeightSubmit = async (formData: FormData) => {
    const result = await Swal.fire({
      title: "Registrar peso",
      text: "Se guardará este control de peso en el historial.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar peso",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0F766E",
    });

    if (result.isConfirmed) {
      startWeightTransition(() => weightAction(formData));
    }
  };

  const handleVaccineSubmit = async (formData: FormData) => {
    const result = await Swal.fire({
      title: "Registrar vacuna",
      text: "Se guardará esta vacuna en el historial de salud.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar vacuna",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0F766E",
    });

    if (result.isConfirmed) {
      startVaccineTransition(() => vaccineAction(formData));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setOpenForm(openForm === "weight" ? null : "weight")}
        className="inline-flex h-9 items-center gap-1.5 border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
      >
        <FiActivity className="size-4" />
        Registrar peso
      </button>
      <button
        type="button"
        onClick={() => setOpenForm(openForm === "vaccine" ? null : "vaccine")}
        className="inline-flex h-9 items-center gap-1.5 border border-[#B9D9CF] px-3 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#F0F8F5]"
      >
        <FaSyringe className="size-4" />
        Registrar vacuna
      </button>

      {openForm === "weight" && (
        <form noValidate action={handleWeightSubmit} className="w-full border border-[#DCE8E2] bg-[#F7FAF9] p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="weight" className="mb-1.5 block text-xs font-semibold text-[#52736A]">Peso (kg)</label>
              <input id="weight" name="weight" type="number" min="0.1" step="0.1" required className={inputClassName} />
              {weightState.fieldErrors?.weight?.[0] && (
                <FormErrors>{weightState.fieldErrors.weight[0]}</FormErrors>
              )}
            </div>
            <div>
              <label htmlFor="measuredAt" className="mb-1.5 block text-xs font-semibold text-[#52736A]">Fecha</label>
              <input id="measuredAt" name="measuredAt" type="date" defaultValue={getToday()} required className={inputClassName} />
              {weightState.fieldErrors?.measuredAt?.[0] && (
                <FormErrors>{weightState.fieldErrors.measuredAt[0]}</FormErrors>
              )}
            </div>
            <div>
              <label htmlFor="weightNotes" className="mb-1.5 block text-xs font-semibold text-[#52736A]">Notas</label>
              <input id="weightNotes" name="notes" placeholder="Opcional" className={inputClassName} />
              {weightState.fieldErrors?.notes?.[0] && (
                <FormErrors>{weightState.fieldErrors.notes[0]}</FormErrors>
              )}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={isWeightPending || isWeightConfirming} className="bg-[#2A6A5D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
              {isWeightPending || isWeightConfirming ? "Guardando..." : "Guardar peso"}
            </button>
            <button type="button" onClick={() => setOpenForm(null)} className="border border-[#B9D9CF] px-4 py-2 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#EAF4F1]">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {openForm === "vaccine" && (
        <form noValidate action={handleVaccineSubmit} className="w-full border border-[#DCE8E2] bg-[#F7FAF9] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="vaccineName" className="mb-1.5 block text-xs font-semibold text-[#52736A]">Vacuna</label>
              <input id="vaccineName" name="vaccineName" placeholder="Vacuna óctuple" required className={inputClassName} />
              {vaccineState.fieldErrors?.vaccineName?.[0] && (
                <FormErrors>{vaccineState.fieldErrors.vaccineName[0]}</FormErrors>
              )}
            </div>
            <div>
              <label htmlFor="appliedAt" className="mb-1.5 block text-xs font-semibold text-[#52736A]">Fecha de aplicación</label>
              <input id="appliedAt" name="appliedAt" type="date" defaultValue={getToday()} required className={inputClassName} />
              {vaccineState.fieldErrors?.appliedAt?.[0] && (
                <FormErrors>{vaccineState.fieldErrors.appliedAt[0]}</FormErrors>
              )}
            </div>
            <div>
              <label htmlFor="nextDueAt" className="mb-1.5 block text-xs font-semibold text-[#52736A]">Próxima dosis</label>
              <input id="nextDueAt" name="nextDueAt" type="date" className={inputClassName} />
              {vaccineState.fieldErrors?.nextDueAt?.[0] && (
                <FormErrors>{vaccineState.fieldErrors.nextDueAt[0]}</FormErrors>
              )}
            </div>
            <div>
              <label htmlFor="vaccineNotes" className="mb-1.5 block text-xs font-semibold text-[#52736A]">Notas</label>
              <input id="vaccineNotes" name="notes" placeholder="Opcional" className={inputClassName} />
              {vaccineState.fieldErrors?.notes?.[0] && (
                <FormErrors>{vaccineState.fieldErrors.notes[0]}</FormErrors>
              )}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={isVaccinePending || isVaccineConfirming} className="bg-[#2A6A5D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
              {isVaccinePending || isVaccineConfirming ? "Guardando..." : "Guardar vacuna"}
            </button>
            <button type="button" onClick={() => setOpenForm(null)} className="border border-[#B9D9CF] px-4 py-2 text-xs font-semibold text-[#1D554A] transition-colors hover:bg-[#EAF4F1]">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
