import { services, servicesCopy } from "../data";
import ServiceCard from "./ServiceCard";

export default function ServicesSection() {
  return (
    <section id="servicios" className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c96f4d]">
          {servicesCopy.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[#23362e]">
          {servicesCopy.title}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}