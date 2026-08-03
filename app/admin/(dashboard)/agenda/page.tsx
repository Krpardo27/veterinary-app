import AdminSectionPage from "@/features/admin/components/AdminSectionPage";

export default function AgendaPage() {
  return (
    <AdminSectionPage
      eyebrow="Agenda"
      title="Agenda clínica"
      description="Organiza las consultas y revisa el flujo diario del centro veterinario."
      badge="Calendario"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Turnos del día</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Aquí se mostrará el resumen de atenciones, revisiones y procedimientos.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Disponibilidad</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            El sistema podrá mostrar huecos libres y cargas de trabajo por profesional.
          </p>
        </div>
      </div>
    </AdminSectionPage>
  );
}
