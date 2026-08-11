"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { COLORS } from "@/shared/constants/theme";

const faqs = [
  {
    question: "¿Cómo reservo una cita?",
    answer: "Puedes reservar directamente desde nuestra web en /reservar. Elige el servicio, selecciona el horario disponible e ingresa los datos de tu mascota. En menos de 2 minutos tienes tu cita confirmada.",
  },
  {
    question: "¿Qué pasa si necesito cancelar mi reserva?",
    answer: "Puedes cancelar con al menos 12 horas de anticipación contactándonos por teléfono o correo. Entendemos que los imprevistos ocurren y buscamos siempre acomodarte en otro horario disponible.",
  },
  {
    question: "¿Atienden urgencias?",
    answer: "Sí, contamos con atención prioritaria para urgencias. Te recomendamos llamarnos antes de venir para preparar la atención y asegurarnos de tener disponibilidad inmediata para tu mascota.",
  },
  {
    question: "¿Qué especies atienden?",
    answer: "Atendemos perros, gatos, aves y otras mascotas de compañía. Para especies exóticas o silvestres, te recomendamos consultar previamente con nuestro equipo.",
  },
  {
    question: "¿Tienen servicio a domicilio?",
    answer: "Ofrecemos visitas a domicilio para casos seleccionados, como pacientes postoperatorios o mascotas con movilidad reducida. Consulta disponibilidad y tarifas con nosotros.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-2xl border transition-all"
      style={{
        borderColor: open ? COLORS.primary : COLORS.border,
        backgroundColor: open ? COLORS.primary_bg : COLORS.bg_white,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>
          {question}
        </span>
        <FiChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: COLORS.primary }}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm leading-7" style={{ color: COLORS.text }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: COLORS.primary_bg, color: COLORS.primary }}
          >
            ❓ Preguntas frecuentes
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: COLORS.darker }}
          >
            ¿Tienes dudas?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed" style={{ color: COLORS.text_muted }}>
            Aquí respondemos las consultas más comunes.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
