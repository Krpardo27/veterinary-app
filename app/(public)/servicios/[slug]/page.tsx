import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import CategoryList from "@/features/servicios/components/CategoryList";
import ServiciosSection from "@/features/servicios/components/ServicesSection";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return {
    title: category ? `${category.name} | Luma Vet` : "Servicios | Luma Vet",
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        services: {
          where: { isActive: true },
          orderBy: [{ featured: "desc" }, { name: "asc" }],
        },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!category) notFound();

  return (
    <main className="min-h-screen bg-[#F7FAF9]">
      <div className="relative overflow-hidden border-b border-[#E2E8E5] bg-white">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#EAF4F1] opacity-60 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-[#D1FAE5] opacity-40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4F1] px-3 py-1 text-xs font-semibold text-[#0F766E]">
              🐾 Cuidado integral
            </span>
            {/* Active category badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F766E]/20 bg-[#0F766E] px-3 py-1 text-xs font-semibold text-white">
              {category.name}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Nuestros servicios
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#64748B]">
            {category.description ??
              "Consultas, cirugías, vacunación y estética para el bienestar de tu mascota, con atención personalizada en cada etapa."}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 sm:py-10">
        <div className="sticky top-0 z-10 -mx-4 bg-[#F7FAF9]/90 px-4 py-3 backdrop-blur-sm">
          <CategoryList categories={categories} />
        </div>

        <ServiciosSection
          services={category.services}
          emptyMessage={`No hay servicios disponibles en ${category.name}.`}
        />

        <div className="text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-[#0F766E]"
          >
            <FiArrowLeft className="h-4 w-4" />
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </main>
  );
}

