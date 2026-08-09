"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FiArchive } from "react-icons/fi";
import Swal from "sweetalert2";
import { archiveCustomerAction } from "@/features/dashboard/clients/actions/archive-customer.action";

export default function ArchiveCustomerButton({
  customerId,
  customerName,
}: {
  customerId: string;
  customerName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleArchive() {
    const confirm = await Swal.fire({
      title: "Dar de baja cliente",
      text: `${customerName} dejará de aparecer en los clientes activos, pero su historial se conservará.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, dar de baja",
      cancelButtonText: "Volver",
      confirmButtonColor: "#b45309",
      background: "#111111",
      color: "#f4f4f5",
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await archiveCustomerAction(customerId);

      if (result.error) {
        await Swal.fire({
          title: "No se pudo dar de baja",
          text: result.error,
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc2626",
          background: "#111111",
          color: "#f4f4f5",
        });
        return;
      }

      await Swal.fire({
        title: "Cliente dado de baja",
        text: "El historial del cliente se mantuvo sin cambios.",
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#16a34a",
        background: "#111111",
        color: "#f4f4f5",
      });

      router.push("/admin/clientes");
    });
  }

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={isPending}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-amber-500/25 px-3 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FiArchive className="h-4 w-4" />
      {isPending ? "Dando de baja" : "Dar de baja"}
    </button>
  );
}