import Banner from "@/features/shop/components/Banner";
import Hero from "./Hero";
import Link from "next/link";
import VeterinaryTeam from "./VeterinaryTeam";
import ServiceCard from "./ServiceCard";
import StatsBar from "./StatsBar";
import Testimonials from "./Testimonials";
import FaqSection from "./FaqSection";
import CtaSection from "./CtaSection";
import { COLORS } from "@/shared/constants/theme";
import { FaHeart, FaStethoscope, FaClock } from "react-icons/fa";

const services = [
  {
    title: "Preventiva",
    description: "Chequeos, vacunas y seguimiento para que cada etapa sea saludable.",
    icon: FaHeart,
  },
  {
    title: "Especialidades",
    description: "Atención médica integral con diagnóstico y tratamientos personalizados.",
    icon: FaStethoscope,
  },
  {
    title: "Flexibilidad",
    description: "Citas ágiles, seguimiento telefónico y acompañamiento en casa.",
    icon: FaClock,
  },
];

export default function PublicLanding() {
  return (
    <div className="min-h-screen bg-transparent">
      <Hero />

      <StatsBar />

      <section id="servicios" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: COLORS.accent }}>
            Servicios
          </p>
          <h2 className="mt-3 text-3xl font-semibold" style={{ color: COLORS.dark }}>
            Una clínica pensada para fortalecer el vínculo con tu mascota.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
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

      <Testimonials />

      <CtaSection />

      <FaqSection />
    </div>
  );
}
