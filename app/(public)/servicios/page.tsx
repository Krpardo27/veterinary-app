import { prisma } from "@/lib/prisma";
import CategoryList from "@/features/servicios/components/CategoryList";
import ServiciosSection from "@/features/servicios/components/ServicesSection";

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#F7FAF9]">
      <div className="border-b border-[#E2E8E5] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4F1] px-3 py-1 text-xs font-semibold text-[#0F766E]">
            🐾 Cuidado integral
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Nuestros servicios
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#64748B]">
            Consultas, cirugías, vacunación y estética para el bienestar de tu
            mascota, con atención personalizada en cada etapa.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 sm:py-10">
        <div className="sticky top-0 z-10 -mx-4 bg-[#F7FAF9]/90 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl">
            <CategoryList categories={categories} />
          </div>
        </div>

        <ServiciosSection
          services={services}
          emptyMessage="No hay servicios disponibles en este momento."
        />
      </div>
    </main>
  );
}