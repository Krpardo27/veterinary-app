"use client";

import { motion, type Variants } from "framer-motion";
import { COLORS } from "@/shared/constants/theme";

const stats = [
  { value: "+8 años", label: "de experiencia clínica" },
  { value: "+1.200", label: "mascotas atendidas" },
  { value: "98%", label: "dueños satisfechos" },
  { value: "5", label: "profesionales certificados" },
];

const statsGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function StatsBar() {
  return (
    <section
      className="border-y py-10"
      style={{ borderColor: COLORS.border, backgroundColor: COLORS.primary_bg }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={statsGroupVariants}
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.value} variants={statVariants} className="text-center">
              <p className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: COLORS.primary }}>
                {stat.value}
              </p>
              <p className="mt-1 text-sm" style={{ color: COLORS.text }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
