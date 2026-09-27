"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { COLORS } from "@/shared/constants/theme";
import { FaQuoteLeft } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Heading from "@/shared/ui/Heading";

const testimonials = [
  {
    quote:
      "Llevamos a Milo desde cachorro y el equipo siempre nos ha tratado con mucha dedicación. No cambiaríamos de veterinaria.",
    author: "Valentina R.",
    pet: "Dueña de Milo, Border Collie",
  },
  {
    quote:
      "Mi gata Luna tuvo una cirugía complicada y la atención fue impecable. El seguimiento post-operatorio fue excelente.",
    author: "Rodrigo M.",
    pet: "Dueño de Luna, Gata Persa",
  },
  {
    quote:
      "La reserva online es super fácil y los horarios son muy flexibles. Puedo agendar en minutos desde el celular.",
    author: "Camila F.",
    pet: "Dueña de Coco, Golden Retriever",
  },
  {
    quote:
      "En la consulta explicaron todo con calma y mi perro salió tranquilo. Se nota el cuidado en los detalles.",
    author: "Daniela P.",
    pet: "Dueña de Bruno, Mestizo",
  },
  {
    quote:
      "Agendé baño y control el mismo día. Fue cómodo, puntual y el equipo tuvo muy buena disposición.",
    author: "Matías S.",
    pet: "Dueño de Nala, Beagle",
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const timeoutId = window.setTimeout(() => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    }, 0);

    emblaApi.on("select", onSelect);

    return () => {
      window.clearTimeout(timeoutId);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      className="py-20 sm:py-24"
      style={{ backgroundColor: COLORS.bg_light }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Heading 
            level={3}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: COLORS.primary_bg,
              color: COLORS.primary,
            }}
          >
            🐾 Lo que dicen nuestros clientes
          </Heading>
          <Heading
            level={2}
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: COLORS.darker }}
          >
            Historias reales, cuidados reales
          </Heading>
        </div>

        <div className="mt-14 overflow-hidden [--slide-gap:1.25rem] [--slides-per-view:1] sm:[--slides-per-view:2] lg:[--slides-per-view:4]" ref={emblaRef}>
          <div className="flex gap-(--slide-gap)">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="min-w-0 flex-[0_0_calc((100%-(var(--slide-gap)*(var(--slides-per-view)-1)))/var(--slides-per-view))]"
              >
                <article
                  className="flex h-full flex-col rounded-3xl p-7"
                  style={{
                    backgroundColor: COLORS.bg_white,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: `0 2px 16px -4px ${COLORS.primary}18`,
                  }}
                >
                  <FaQuoteLeft
                    className="mb-4 h-6 w-6 opacity-30"
                    style={{ color: COLORS.primary }}
                  />
                  <p
                    className="flex-1 text-base leading-7"
                    style={{ color: COLORS.text }}
                  >
                    {t.quote}
                  </p>
                  <div
                    className="mt-6 border-t pt-4"
                    style={{ borderColor: COLORS.border_subtle }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: COLORS.dark }}
                    >
                      {t.author}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.text_muted }}>
                      {t.pet}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Ver testimonios anteriores"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors hover:border-[#0F766E] hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
            style={{ borderColor: COLORS.border, color: COLORS.primary }}
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Ir al grupo de testimonios ${index + 1}`}
                className={`h-2 rounded-full transition-all ${index === selectedIndex ? "w-6" : "w-2"}`}
                style={{
                  backgroundColor:
                    index === selectedIndex ? COLORS.primary : "#B9D9CF",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Ver siguientes testimonios"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors hover:border-[#0F766E] hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
            style={{ borderColor: COLORS.border, color: COLORS.primary }}
          >
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
