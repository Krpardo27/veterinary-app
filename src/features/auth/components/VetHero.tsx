import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiShield } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
// import BackgroundPattern from "./BackgroundPattern";
import VetIllustration from "./VetIllustration";
import StatCard from "./StatCard";
import FeatureCard from "./FeatureCard";

export default function VetHero() {
  return (
    <section className="relative hidden min-h-160 flex-col justify-between overflow-hidden border-r border-[#E2E8F0] p-8 lg:flex">
      <div className="relative">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#DCEAE3] transition-colors hover:bg-white/5 hover:text-white"
        >
          <FiArrowLeft className="h-3.5 w-3.5" />
          Volver al sitio
        </Link>
      </div>

      <div className="relative space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f4c96d]">
          Portal clínico
        </p>
        <div className="space-y-3">
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight  xl:text-5xl">
            La ficha de cada paciente, siempre al día.
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-[#B9CFC7]">
            Agenda, historiales y equipo en un solo panel, pensado para el
            ritmo real de la consulta.
          </p>
        </div>

        <div className="relative flex justify-center py-2">
          <VetIllustration />
          <StatCard
            value="+1.200"
            label="mascotas atendidas"
            className="absolute -left-2 top-0 hidden rotate-[-4deg] xl:block"
          />
          <StatCard
            value="98%"
            label="dueños conformes"
            className="absolute -right-2 bottom-4 hidden rotate-[3deg] xl:block"
          />
        </div>
      </div>

      <div className="relative grid grid-cols-3 gap-3">
        <FeatureCard icon={<FiCalendar className="h-4 w-4" />} label="Reservas" />
        <FeatureCard icon={<FaPaw className="h-4 w-4" />} label="Pacientes" />
        <FeatureCard icon={<FiShield className="h-4 w-4" />} label="Acceso seguro" />
      </div>
    </section>
  );
}
