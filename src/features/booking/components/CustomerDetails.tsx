"use client";

import { useReducer, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { ReservationFormData } from "../schemas/reservation.schema";
import FormErrors from "@/features/admin/components/FormErrors";

type Customer = {
  id: string;
  name: string;
  phone: string;
};

type LookupState = {
  mode: "search" | "new";
  searchPhone: string;
  newPhone: string;
  searching: boolean;
  found: Customer | null;
  notFound: boolean;
  existingInNew: Customer | null;
};

const initialLookupState: LookupState = {
  mode: "search",
  searchPhone: "+569",
  newPhone: "+569",
  searching: false,
  found: null,
  notFound: false,
  existingInNew: null,
};

type LookupAction =
  | { type: "modeChanged"; mode: LookupState["mode"] }
  | { type: "searchPhoneChanged"; phone: string }
  | { type: "searchStarted" }
  | { type: "searchFound"; customer: Customer }
  | { type: "searchNotFound" }
  | { type: "searchSkipped" }
  | { type: "searchStopped" }
  | { type: "newPhoneChanged"; phone: string }
  | { type: "newPhoneDuplicateFound"; customer: Customer }
  | { type: "newPhoneDuplicateCleared" };

function lookupReducer(state: LookupState, action: LookupAction): LookupState {
  switch (action.type) {
    case "modeChanged":
      return { ...initialLookupState, mode: action.mode };
    case "searchPhoneChanged":
      return { ...state, searchPhone: action.phone };
    case "searchStarted":
      return { ...state, searching: true };
    case "searchFound":
      return { ...state, searching: false, found: action.customer, notFound: false };
    case "searchNotFound":
      return { ...state, searching: false, found: null, notFound: true };
    case "searchSkipped":
      return { ...state, searching: false, found: null, notFound: false };
    case "searchStopped":
      return { ...state, searching: false };
    case "newPhoneChanged":
      return { ...state, newPhone: action.phone };
    case "newPhoneDuplicateFound":
      return { ...state, existingInNew: action.customer };
    case "newPhoneDuplicateCleared":
      return { ...state, existingInNew: null };
  }
}

function formatPhone(value: string): string {
  let nationalNumber = value.replace(/\D/g, "");

  if (nationalNumber.startsWith("56")) {
    nationalNumber = nationalNumber.slice(2);
  }

  if (nationalNumber.startsWith("9")) {
    nationalNumber = nationalNumber.slice(1);
  }

  return `+569${nationalNumber.slice(0, 8)}`;
}

const inputClassName =
  "w-full border border-[#DCE8E2] bg-[#FCFDFC] px-4 py-3 text-sm text-[#1D3A35] transition-colors outline-none placeholder:text-[#8A9B95] focus:border-[#2A6A5D] focus:ring-2 focus:ring-[#2A6A5D]/10";

export default function CustomerDetails({
  form,
}: {
  form: UseFormReturn<ReservationFormData>;
}) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;
  const [lookup, dispatch] = useReducer(lookupReducer, initialLookupState);
  const latestSearchPhone = useRef(lookup.searchPhone);
  const latestNewPhone = useRef(lookup.newPhone);

  const clearSelectedCustomer = () => {
    setValue("customerId", undefined);
    setValue("customerName", "");
    setValue("customerPhone", "");
    setValue("customerEmail", "");
  };

  const resetCustomerMode = (mode: LookupState["mode"]) => {
    latestSearchPhone.current = initialLookupState.searchPhone;
    latestNewPhone.current = initialLookupState.newPhone;
    setValue("customerMode", mode);
    dispatch({ type: "modeChanged", mode });
    clearSelectedCustomer();
  };

  const findCustomer = async (phone: string) => {
    const response = await fetch("/api/customers/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    return response.json() as Promise<{ customer?: Customer }>;
  };

  const handleSearch = async (phone: string) => {
    if (phone.length < 12) {
      dispatch({ type: "searchSkipped" });
      clearSelectedCustomer();
      return;
    }

    dispatch({ type: "searchStarted" });

    try {
      const data = await findCustomer(phone);

      if (latestSearchPhone.current !== phone) {
        return;
      }

      if (data.customer) {
        dispatch({ type: "searchFound", customer: data.customer });
        setValue("customerId", data.customer.id);
        setValue("customerName", data.customer.name);
        setValue("customerPhone", data.customer.phone);
        toast.success(`Cliente encontrado: ${data.customer.name}`);
      } else {
        dispatch({ type: "searchNotFound" });
        clearSelectedCustomer();
        toast.info("Este número no se encuentra registrado");
      }
    } catch {
      toast.error("No fue posible buscar el cliente");
    } finally {
      if (latestSearchPhone.current === phone) {
        dispatch({ type: "searchStopped" });
      }
    }
  };

  const handleNewPhoneSearch = async (phone: string) => {
    if (phone.length < 12) {
      dispatch({ type: "newPhoneDuplicateCleared" });
      setValue("customerId", undefined);
      return;
    }

    try {
      const data = await findCustomer(phone);

      if (latestNewPhone.current !== phone) {
        return;
      }

      if (data.customer) {
        dispatch({ type: "newPhoneDuplicateFound", customer: data.customer });
        setValue("customerId", data.customer.id);
        toast.warning("Número ya registrado", {
          duration: 5000,
          style: {
            borderColor: "rgba(200, 169, 110, 0.4)",
            color: "#F5E6C8",
          },
        });
      } else {
        dispatch({ type: "newPhoneDuplicateCleared" });
        setValue("customerId", undefined);
      }
    } catch {
      // The duplicate check is advisory; regular form validation remains available.
    }
  };

  const onlyPhoneDigits = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#52736A]">
        Datos del cliente
      </p>

      <div className="space-y-4">
        <input type="hidden" {...register("customerMode")} />

        <div className="grid grid-cols-2 border border-[#DCE8E2] bg-[#F7FAF9] p-1">
          {(["search", "new"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => resetCustomerMode(mode)}
              className={`py-2.5 text-sm font-semibold transition-colors ${
                lookup.mode === mode
                  ? "bg-white text-[#0F766E] shadow-sm"
                  : "text-[#6F817A] hover:text-[#1D3A35]"
              }`}
            >
              {mode === "search" ? "Cliente existente" : "Cliente nuevo"}
            </button>
          ))}
        </div>

        {lookup.mode === "search" ? (
          <div className="space-y-3">
            <input
              type="tel"
              aria-label="Teléfono del cliente existente"
              placeholder="+56912345678"
              maxLength={12}
              value={lookup.searchPhone}
              onChange={(event) => {
                const phone = formatPhone(event.target.value);
                latestSearchPhone.current = phone;
                dispatch({ type: "searchPhoneChanged", phone });
                handleSearch(phone);
              }}
              onKeyDown={onlyPhoneDigits}
              className={inputClassName}
            />

            {lookup.searching && <p className="text-xs text-[#6F817A]">Buscando...</p>}

            {lookup.found && (
              <div className="border border-[#B9D9CF] bg-[#F0F8F5] px-4 py-3">
                <p className="text-sm font-semibold text-[#1D3A35]">{lookup.found.name}</p>
                <p className="text-xs text-[#5C6F68]">{lookup.found.phone}</p>
              </div>
            )}

            {lookup.notFound && (
              <p className="text-xs text-[#6F817A]">
                No encontrado.{" "}
                <button
                  type="button"
                  onClick={() => resetCustomerMode("new")}
                  className="font-semibold text-[#0F766E] underline underline-offset-2"
                >
                  Crear cliente nuevo
                </button>
              </p>
            )}

            {errors.customerId && <FormErrors>{errors.customerId.message}</FormErrors>}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor="customer-name" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
                Nombre
              </label>
              <input id="customer-name" type="text" placeholder="Juan Pérez" {...register("customerName")} className={inputClassName} />
              {errors.customerName && <FormErrors>{errors.customerName.message}</FormErrors>}
            </div>

            <div>
              <label htmlFor="customer-phone" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
                Teléfono
              </label>
              <input
                id="customer-phone"
                type="tel"
                placeholder="+56912345678"
                maxLength={12}
                value={lookup.newPhone}
                onChange={(event) => {
                  const phone = formatPhone(event.target.value);
                  latestNewPhone.current = phone;
                  dispatch({ type: "newPhoneChanged", phone });
                  setValue("customerPhone", phone, { shouldValidate: true });
                  handleNewPhoneSearch(phone);
                }}
                onKeyDown={onlyPhoneDigits}
                className={inputClassName}
              />

              {lookup.existingInNew && (
                <div className="mt-2 border border-[#B9D9CF] bg-[#F0F8F5] px-4 py-3">
                  <p className="text-xs font-semibold text-[#0F766E]">Número ya registrado</p>
                </div>
              )}

              {errors.customerPhone && <FormErrors>{errors.customerPhone.message}</FormErrors>}
            </div>

            <div>
              <label htmlFor="customer-email" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
                Email (opcional)
              </label>
              <input id="customer-email" type="email" placeholder="juan@email.com" {...register("customerEmail")} className={inputClassName} />
              {errors.customerEmail && <FormErrors>{errors.customerEmail.message}</FormErrors>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
