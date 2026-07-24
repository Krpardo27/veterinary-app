import Navbar from "../../../shared/components/Navbar";
import Hero from "./Hero";
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
      <Navbar />

      <main>
        <Hero />

        <section id="servicios" className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#e08b4f]">
              Servicios
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#17322c]">
              Una clínica pensada para fortalecer el vínculo con tu mascota.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <article
                  key={index}
                  className="rounded-[1.5rem] border border-[#dce8e2] bg-white/80 p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf4ee] text-[#2a6a5d]">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#17322c]">{service.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#5c6f68]">{service.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="equipo" className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <div className="rounded-[2rem] border border-[#dce8e2] bg-[#18332d] px-8 py-10 text-white shadow-[0_25px_60px_-25px_rgba(24,51,45,0.45)] lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9dc7b3]">
                  Equipo
                </p>
                <h2 className="mt-3 text-3xl font-semibold">
                  Cuidamos con experiencia, empatía y tecnología.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-[#dce9e4]">
                  Nuestro equipo combina medicina veterinaria, seguimiento cercano y protocolos de bienestar para que cada visita sea tranquila.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-6 backdrop-blur">
                <p className="text-lg font-semibold">Horario de atención</p>
                <ul className="mt-4 space-y-3 text-sm text-[#e6f2ee]">
                  <li>• Lunes a viernes: 8:00 - 20:00</li>
                  <li>• Sábados: 9:00 - 14:00</li>
                  <li>• Urgencias: atención prioritaria</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="contacto"
        className="border-t border-[#dce8e2] bg-[#eef5f0] px-6 py-8 text-center text-sm text-[#5c6f68]"
      >
        <p className="font-semibold text-[#17322c]">Luma Vet</p>
        <p className="mt-2">Av. Central 123 · contacto@lumavet.com · +34 600 123 456</p>
      </footer>
    </div>
  );
}
