"use client";

import { useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaArrowLeft, FaArrowRight, FaPaw, FaShieldAlt, FaStethoscope } from "react-icons/fa";

const slides = [
  {
    title: "Salud integral en cada visita",
    description: "Diagnóstico, prevención y seguimiento con un equipo que prioriza la comodidad de tu mascota.",
    badge: "Consulta médica",
    icon: FaStethoscope,
  },
  {
    title: "Bienestar en casa y en clínica",
    description: "Ofrecemos atención personalizada, hospitalización y planes de seguimiento pensados para tu rutina.",
    badge: "Cuidado continuo",
    icon: FaShieldAlt,
  },
  {
    title: "Amor, experiencia y tecnología",
    description: "Tu compañero recibe atención moderna con un enfoque humano, calmado y cercano.",
    badge: "Experiencia premium",
    icon: FaPaw,
  },
];

export default function Hero() {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay.current]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
      <div className="flex flex-col justify-center">
        <span className="mb-4 w-fit rounded-full border border-[#b9d6c6] bg-[#eaf4ee] px-3 py-1 text-sm font-semibold text-[#2f6f64]">
          Veterinaria moderna y cercana
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#17322c] sm:text-5xl">
          Tu mascota merece una atención con alma, ciencia y mucho cuidado.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#5c6f68]">
          En Luma Vet cuidamos de cada etapa de la vida de tu compañero con medicina preventiva, hospitalización y un trato humano.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contacto" className="rounded-full bg-[#2a6a5d] px-5 py-3 font-semibold text-white transition hover:bg-[#1f5248]">
            Reservar cita
          </a>
          <a href="#servicios" className="rounded-full border border-[#2a6a5d]/20 bg-white px-5 py-3 font-semibold text-[#2a6a5d] transition hover:border-[#2a6a5d]">
            Ver servicios
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-[#5c6f68]">
          <div className="rounded-2xl border border-[#dce8e2] bg-white/80 px-4 py-3 shadow-sm">
            <p className="font-semibold text-[#2a6a5d]">+8 años</p>
            <p>cuidando mascotas</p>
          </div>
          <div className="rounded-2xl border border-[#dce8e2] bg-white/80 px-4 py-3 shadow-sm">
            <p className="font-semibold text-[#2a6a5d]">Atención integral</p>
            <p>prevención, diagnóstico y seguimiento</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#dce8e2] bg-[#fcfbf7] p-4 shadow-[0_20px_60px_-20px_rgba(42,106,93,0.22)]">
        <div className="overflow-hidden rounded-[1.5rem] bg-[#f3f6f1]">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {slides.map((slide, index) => {
                const Icon = slide.icon;

                return (
                  <div key={index} className="embla__slide min-w-full p-8 sm:p-10">
                    <div className="rounded-[1.5rem] bg-white p-7 shadow-sm">
                      <span className="inline-flex rounded-full bg-[#eaf4ee] px-3 py-1 text-sm font-semibold text-[#2a6a5d]">
                        {slide.badge}
                      </span>
                      <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#fef0e3] text-[#e08b4f]">
                        <Icon className="text-xl" />
                      </div>
                      <h2 className="mt-5 text-2xl font-semibold text-[#17322c]">{slide.title}</h2>
                      <p className="mt-3 text-base leading-7 text-[#5c6f68]">{slide.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#dce8e2] px-6 py-4">
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <span key={index} className="h-2.5 w-2.5 rounded-full bg-[#9dc7b3]" />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={scrollPrev} className="rounded-full border border-[#dce8e2] bg-white p-2 text-[#2a6a5d] transition hover:bg-[#f3f6f1]">
                <FaArrowLeft />
              </button>
              <button type="button" onClick={scrollNext} className="rounded-full border border-[#dce8e2] bg-white p-2 text-[#2a6a5d] transition hover:bg-[#f3f6f1]">
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
