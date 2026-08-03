import AdminSectionPage from "@/features/admin/components/AdminSectionPage";

export default function BarberosPage() {
  return (
    <AdminSectionPage
      eyebrow="Equipo"
      title="Barberos"
      description="Controla los perfiles del personal y su asignación de citas."
      badge="Equipo"
    >
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">Personal del centro</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Pronto se podrán gestionar los miembros del equipo desde aquí.
        </p>
      </div>
    </AdminSectionPage>
  );
}
