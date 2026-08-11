"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaPaw, FaShieldAlt, FaStethoscope } from "react-icons/fa";
import Link from "next/link";
import { COLORS } from "@/shared/constants/theme";

const slides = [
  {
    title: "Salud integral en cada visita",
    description: "Diagnóstico, prevención y seguimiento con un equipo que prioriza la comodidad de tu mascota.",
    badge: "Consulta médica",
    icon: FaStethoscope,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80",
    alt: "Veterinario examinando a un perro",
  },
  {
    title: "Bienestar en casa y en clínica",
    description: "Ofrecemos atención personalizada, hospitalización y planes de seguimiento pensados para tu rutina.",
    badge: "Cuidado continuo",
    icon: FaShieldAlt,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    alt: "Perro feliz y saludable",
  },
  {
    title: "Amor, experiencia y tecnología",
    description: "Tu compañero recibe atención moderna con un enfoque humano, calmado y cercano.",
    badge: "Experiencia premium",
    icon: FaPaw,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    alt: "Gato siendo atendido",
  },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4500, stopOnInteraction: false })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-18">
      <div className="flex flex-col justify-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-4 w-fit rounded-full border px-3 py-1 text-sm font-semibold"
          style={{
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primary_bg,
            color: COLORS.secondary,
          }}
        >
          Veterinaria moderna y cercana
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          style={{ color: COLORS.dark }}
        >
          Tu mascota merece una atención con alma, ciencia y mucho cuidado.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
          className="mt-5 max-w-xl text-lg leading-8"
          style={{ color: COLORS.text }}
        >
          En Luma Vet cuidamos de cada etapa de la vida de tu compañero con medicina preventiva, hospitalización y un trato humano.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: "easeOut" }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/reservar"
            className="rounded-full px-5 py-3 font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: COLORS.secondary }}
          >
            Reservar cita
          </Link>
          <a
            href="#servicios"
            className="rounded-full border px-5 py-3 font-semibold transition"
            style={{
              borderColor: `${COLORS.secondary}33`,
              color: COLORS.secondary,
            }}
          >
            Ver servicios
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: "easeOut" }}
          className="mt-8 flex flex-wrap gap-4 text-sm"
          style={{ color: COLORS.text }}
        >
          <div className="rounded-2xl border px-4 py-3 shadow-sm" style={{ borderColor: COLORS.border, backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
            <p className="font-semibold" style={{ color: COLORS.secondary }}>
              +8 años
            </p>
            <p>cuidando mascotas</p>
          </div>
          <div className="rounded-2xl border px-4 py-3 shadow-sm" style={{ borderColor: COLORS.border, backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
            <p className="font-semibold" style={{ color: COLORS.secondary }}>
              Atención integral
            </p>
            <p>prevención, diagnóstico y seguimiento</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
        className="rounded-[2rem] border shadow-[0_20px_60px_-20px]"
        style={{
          borderColor: COLORS.border,
          backgroundColor: "#fcfbf7",
          boxShadow: `0 20px 60px -20px ${COLORS.secondary}38`,
        }}
      >
        <div className="overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: COLORS.primary_bg }}>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {slides.map((slide, index) => {
                const Icon = slide.icon;
                return (
                  <div key={index} className="embla__slide min-w-full">
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Card content */}
                    <div className="bg-white p-6">
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
                        style={{
                          backgroundColor: COLORS.secondary_bg,
                          color: COLORS.secondary,
                        }}
                      >
                        {slide.badge}
                      </span>
                      <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full text-lg" style={{ backgroundColor: "#fef0e3", color: COLORS.accent }}>
                        <Icon />
                      </div>
                      <h2 className="mt-4 text-xl font-semibold" style={{ color: COLORS.dark }}>
                        {slide.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6" style={{ color: COLORS.text }}>
                        {slide.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t px-6 py-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg_white }}>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === selectedIndex ? "w-5" : "w-2 hover:opacity-70"
                  }`}
                  aria-label={`Ir al slide ${index + 1}`}
                  style={{
                    backgroundColor: index === selectedIndex ? COLORS.secondary : "#9dc7b3",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                className="rounded-full border p-2 transition"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.bg_white,
                  color: COLORS.secondary,
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="rounded-full border p-2 transition"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.bg_white,
                  color: COLORS.secondary,
                }}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
