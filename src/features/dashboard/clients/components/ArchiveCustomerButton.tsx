"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FiArchive } from "react-icons/fi";
import { archiveCustomerAction } from "@/features/dashboard/clients/actions/archive-customer.action";
import { confirmSwal, feedbackSwal, swalSummaryHtml } from "@/shared/utils/sweetAlert";

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
    const confirm = await confirmSwal({
      title: "Dar de baja cliente",
      html: swalSummaryHtml([
        { label: "Cliente", value: customerName },
        { label: "Efecto", value: "Dejará de aparecer en clientes activos" },
        { label: "Historial", value: "Se conservará sin cambios" },
      ]),
      icon: "warning",
      confirmButtonText: "Sí, dar de baja",
      confirmButtonColor: "#b45309",
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await archiveCustomerAction(customerId);

      if (result.error) {
        await feedbackSwal({
          title: "No se pudo dar de baja",
          message: result.error,
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
        return;
      }

      await feedbackSwal({
        title: "Cliente dado de baja",
        message: "El historial del cliente se mantuvo sin cambios.",
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#16a34a",
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