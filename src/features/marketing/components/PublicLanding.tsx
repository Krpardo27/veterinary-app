import Banner from "@/features/shop/components/Banner";
import Hero from "./Hero";
import Link from "next/link";
import { FaHeart, FaStethoscope, FaClock } from "react-icons/fa";
import VeterinaryTeam from "./VeterinaryTeam";
import { COLORS } from "@/shared/constants/theme";

const services = [
  {
    title: "Preventiva",
    description:
      "Chequeos, vacunas y seguimiento para que cada etapa sea saludable.",
    icon: FaHeart,
  },
  {
    title: "Especialidades",
    description:
      "Atención médica integral con diagnóstico y tratamientos personalizados.",
    icon: FaStethoscope,
  },
  {
    title: "Flexibilidad",
    description:
      "Citas ágiles, seguimiento telefónico y acompañamiento en casa.",
    icon: FaClock,
  },
];

export default function PublicLanding() {
  return (
    <div className="min-h-screen bg-transparent">
      <Hero />

      <section id="servicios" className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: COLORS.accent }}>
            Servicios
          </p>
          <h2 className="mt-3 text-3xl font-semibold" style={{ color: COLORS.dark }}>
            Una clínica pensada para fortalecer el vínculo con tu mascota.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={index}
                className="rounded-[1.5rem] border p-6"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.secondary_bg, color: COLORS.secondary }}>
                  <Icon className="text-xl" />
                </div>
                <h3 className="mt-5 text-xl font-semibold" style={{ color: COLORS.dark }}>
                  {service.title}
                </h3>
                <p className="mt-3 text-base leading-7" style={{ color: COLORS.text }}>
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/servicios"
            className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            Ver todos los servicios
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <Banner />
      </section>

      <VeterinaryTeam />
    </div>
  );
}
