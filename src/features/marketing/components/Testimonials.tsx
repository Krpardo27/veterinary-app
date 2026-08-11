import { COLORS } from "@/shared/constants/theme";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    quote: "Llevamos a Milo desde cachorro y el equipo siempre nos ha tratado con mucha dedicación. No cambiaríamos de veterinaria.",
    author: "Valentina R.",
    pet: "Dueña de Milo, Border Collie",
  },
  {
    quote: "Mi gata Luna tuvo una cirugía complicada y la atención fue impecable. El seguimiento post-operatorio fue excelente.",
    author: "Rodrigo M.",
    pet: "Dueño de Luna, Gata Persa",
  },
  {
    quote: "La reserva online es super fácil y los horarios son muy flexibles. Puedo agendar en minutos desde el celular.",
    author: "Camila F.",
    pet: "Dueña de Coco, Golden Retriever",
  },
];

export default function Testimonials() {
  return (
    <section
      className="py-20 sm:py-24"
      style={{ backgroundColor: COLORS.bg_light }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: COLORS.primary_bg, color: COLORS.primary }}
          >
            🐾 Lo que dicen nuestros clientes
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: COLORS.darker }}
          >
            Historias reales, cuidados reales
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.author}
              className="flex flex-col rounded-3xl p-7"
              style={{
                backgroundColor: COLORS.bg_white,
                border: `1px solid ${COLORS.border}`,
                boxShadow: `0 2px 16px -4px ${COLORS.primary}18`,
              }}
            >
              <FaQuoteLeft className="mb-4 h-6 w-6 opacity-30" style={{ color: COLORS.primary }} />
              <p className="flex-1 text-base leading-7" style={{ color: COLORS.text }}>
                {t.quote}
              </p>
              <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border_subtle }}>
                <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                  {t.author}
                </p>
                <p className="text-xs" style={{ color: COLORS.text_muted }}>
                  {t.pet}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
