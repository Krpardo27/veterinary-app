import AdminSectionPage from "@/features/admin/components/AdminSectionPage";

export default function ReservasPage() {
  return (
    <AdminSectionPage
      eyebrow="Gestión clínica"
      title="Reservas"
      description="Gestiona las reservas entrantes y mantén el flujo del centro al día."
      badge="Próximamente"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Reservas de hoy</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Se mostrará el resumen de las visitas programadas para la jornada.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Estado general</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Aquí aparecerán los recordatorios y controles para cambios de horario.
          </p>
        </div>
      </div>
    </AdminSectionPage>
  );
}
