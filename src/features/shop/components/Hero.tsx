"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLORS } from "@/shared/constants/theme";

export default function Hero() {
  return (
    <section className="relative isolate min-h-170 overflow-hidden bg-[#102D29] sm:min-h-180 lg:min-h-190">
      <Image
        src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1800&q=85"
        alt="Perro en consulta veterinaria"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#102D29]/35" />
      <div className="absolute inset-0 bg-linear-to-r from-[#102D29]/95 via-[#102D29]/68 to-transparent" />

      <div className="relative mx-auto flex min-h-170 max-w-7xl items-center px-6 py-14 sm:min-h-180 sm:py-18 lg:min-h-190 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#BDE4D8]">
            Veterinaria El Abrazo
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Salud y bienestar para tu mascota.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
            Consultas veterinarias, vacunación, controles y peluquería en un mismo lugar.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/reservar"
              className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ backgroundColor: COLORS.accent }}
            >
              Reservar hora
            </Link>
            <Link
              href="/servicios"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/35 px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Ver servicios
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
