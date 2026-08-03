import AdminSectionPage from "@/features/admin/components/AdminSectionPage";

export default function ServiciosPage() {
  return (
    <AdminSectionPage
      eyebrow="Catálogo"
      title="Servicios"
      description="Administra los servicios clínicos y sus detalles para el equipo."
      badge="Módulo"
    >
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">Servicios disponibles</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Aquí se podrán crear, editar y publicar los servicios del centro veterinario.
        </p>
      </div>
    </AdminSectionPage>
  );
}
