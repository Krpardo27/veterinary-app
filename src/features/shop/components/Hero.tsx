"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { COLORS } from "@/shared/constants/theme";

const textGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#F4FAF7]">
      <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-[#BDE4D8]/35 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#EFD3BE]/45 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textGroupVariants}
          className="max-w-2xl"
        >
          <motion.p
            variants={fadeUpVariants}
            className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F766E]"
          >
            Veterinaria El Abrazo
          </motion.p>

          <motion.h1
            variants={fadeUpVariants}
            className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-[#102D29] sm:text-6xl lg:text-7xl"
          >
            Salud y bienestar para tu mascota.
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="mt-6 max-w-xl text-base leading-8 text-[#49655D] sm:text-lg"
          >
            Consultas veterinarias, vacunación, controles y peluquería en un mismo lugar.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/reservar"
              className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ backgroundColor: COLORS.accent }}
            >
              Reservar hora
            </Link>
            <Link
              href="/servicios"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#B6CEC6] px-6 text-sm font-semibold text-[#102D29] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
            >
              Ver servicios
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            className="relative min-h-120 overflow-hidden rounded-4xl bg-[#102D29] shadow-2xl shadow-[#102D29]/15">
            <Image
              src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1400&q=85"
              alt="Perro en consulta veterinaria"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#102D29]/22 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            className="absolute -bottom-6 left-6 max-w-64 rounded-3xl bg-white/92 p-5 shadow-2xl shadow-[#102D29]/15 ring-1 ring-[#DCE8E2] backdrop-blur lg:-left-8 lg:bottom-8"
          >
            <p className="text-sm font-semibold text-[#102D29]">Atención integral</p>
            <p className="mt-2 text-sm leading-6 text-[#5C6F68]">
              Controles, vacunas y seguimiento en una misma visita.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
