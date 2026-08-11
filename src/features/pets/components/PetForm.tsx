"use client";

import { useActionState, useEffect, useState } from "react";

import FormErrors from "@/features/admin/components/FormErrors";
import { feedbackSwal } from "@/shared/utils/sweetAlert";
import {
  getBreedsForSpecies,
  MIXED_BREED,
} from "@/features/pets/data/breeds";
import {
  createPetAction,
  type CreatePetState,
  updatePetAction,
} from "../actions/create-pet.action";

type Props = {
  customerId: string;
  onSuccess?: () => void;
  pet?: {
    id: string;
    name: string;
    species: "DOG" | "CAT" | "BIRD" | "OTHER";
    breed: string | null;
    sex: "MALE" | "FEMALE" | "UNKNOWN" | null;
    birthDate: Date | null;
    color: string | null;
    notes: string | null;
  };
};

const initialState: CreatePetState = {
  status: "idle",
  message: "",
};

const inputClassName =
  "w-full border border-[#DCE8E2] bg-[#FCFDFC] px-3 py-2.5 text-sm text-[#1D3A35] outline-none transition-colors focus:border-[#2A6A5D] focus:ring-2 focus:ring-[#2A6A5D]/10";

function dateInputValue(date: Date | null) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

export default function PetForm({ customerId, onSuccess, pet }: Props) {
  const [selectedSpecies, setSelectedSpecies] = useState(
    pet?.species ?? "DOG",
  );
  const initialBreed = pet ? (pet.breed ?? "") : MIXED_BREED;
  const [selectedBreed, setSelectedBreed] = useState(initialBreed);
  const action = pet
    ? updatePetAction.bind(null, pet.id)
    : createPetAction.bind(null, customerId);
  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
  );
  const availableBreeds = getBreedsForSpecies(selectedSpecies);
  const breedOptions = selectedBreed === ""
    ? ["", ...availableBreeds]
    : availableBreeds.includes(selectedBreed)
      ? availableBreeds
      : [...availableBreeds, selectedBreed];

  useEffect(() => {
    if (!state.message) return;

    if (state.status === "success") {
      if (state.unchanged) {
        void feedbackSwal({
          title: "Sin cambios",
          message: state.message,
          icon: "info",
          confirmButtonColor: "#0F766E",
        }).then(() => onSuccess?.());
      } else {
        void feedbackSwal({
          title: "Mascota guardada",
          message: state.message,
          icon: "success",
          confirmButtonColor: "#0F766E",
        }).then(() => onSuccess?.());
      }
    } else if (state.status === "error") {
      void feedbackSwal({
        title: "No fue posible guardar",
        message: state.message,
        icon: "error",
        confirmButtonColor: "#0F766E",
      });
    }
  }, [onSuccess, state.message, state.status, state.unchanged]);

  return (
    <form noValidate action={formAction} className="space-y-4">
      <div>
        <label htmlFor="pet-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Nombre
        </label>
        <input id="pet-name" name="name" required placeholder="Luna" defaultValue={pet?.name} className={inputClassName} />
        {state.fieldErrors?.name?.[0] && (
          <FormErrors>{state.fieldErrors.name[0]}</FormErrors>
        )}
      </div>

      <div>
        <label htmlFor="pet-species" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Especie
        </label>
        <select
          id="pet-species"
          name="species"
          value={selectedSpecies}
          onChange={(event) => {
            setSelectedSpecies(event.target.value as Props["pet"] extends { species: infer Species } ? Species : never);
            setSelectedBreed(MIXED_BREED);
          }}
          className={inputClassName}
        >
          <option value="DOG">Perro</option>
          <option value="CAT">Gato</option>
          <option value="BIRD">Ave</option>
          <option value="OTHER">Otro</option>
        </select>
        {state.fieldErrors?.species?.[0] && (
          <FormErrors>{state.fieldErrors.species[0]}</FormErrors>
        )}
      </div>

      <div>
        <label htmlFor="pet-breed" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
          Raza (opcional)
        </label>
        <select
          id="pet-breed"
          name="breed"
          value={selectedBreed}
          onChange={(event) => setSelectedBreed(event.target.value)}
          className={inputClassName}
        >
          {breedOptions.map((breed) => (
            <option key={breed || "empty"} value={breed}>
              {breed || "Sin registrar"}
            </option>
          ))}
        </select>
        {state.fieldErrors?.breed?.[0] && (
          <FormErrors>{state.fieldErrors.breed[0]}</FormErrors>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pet-sex" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">Sexo</label>
          <select id="pet-sex" name="sex" defaultValue={pet?.sex ?? "UNKNOWN"} className={inputClassName}>
            <option value="UNKNOWN">Sin registrar</option>
            <option value="MALE">Macho</option>
            <option value="FEMALE">Hembra</option>
          </select>
          {state.fieldErrors?.sex?.[0] && <FormErrors>{state.fieldErrors.sex[0]}</FormErrors>}
        </div>
        <div>
          <label htmlFor="pet-birth-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">Nacimiento (opcional)</label>
          <input id="pet-birth-date" name="birthDate" type="date" defaultValue={dateInputValue(pet?.birthDate ?? null)} className={inputClassName} />
          {state.fieldErrors?.birthDate?.[0] && <FormErrors>{state.fieldErrors.birthDate[0]}</FormErrors>}
        </div>
      </div>

      <div>
        <label htmlFor="pet-color" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">Color (opcional)</label>
        <input id="pet-color" name="color" placeholder="Café y blanco" defaultValue={pet?.color ?? ""} className={inputClassName} />
        {state.fieldErrors?.color?.[0] && <FormErrors>{state.fieldErrors.color[0]}</FormErrors>}
      </div>

      <div>
        <label htmlFor="pet-notes" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">Notas (opcional)</label>
        <textarea id="pet-notes" name="notes" rows={3} defaultValue={pet?.notes ?? ""} className={`${inputClassName} resize-none`} />
        {state.fieldErrors?.notes?.[0] && <FormErrors>{state.fieldErrors.notes[0]}</FormErrors>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#2A6A5D] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D554A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Guardando..." : pet ? "Guardar cambios" : "Guardar mascota"}
      </button>
    </form>
  );
}
