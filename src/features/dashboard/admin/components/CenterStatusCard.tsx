export default function CenterStatusCard() {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)]">
      <h3 className="text-lg font-semibold text-[#0F172A]">Centro veterinario</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#64748B]">Nombre</span>
          <span className="font-medium text-[#0F172A]">Veterinaria El Abrazo</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#64748B]">Estado</span>
          <span className="rounded-full bg-[#D1FAE5] px-2.5 py-1 text-xs font-semibold uppercase text-[#0F766E]">
            Operativo
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#64748B]">Modo</span>
          <span className="font-medium text-[#0F172A]">Gestión clínica</span>
        </div>
      </div>
    </section>
  );
}