import Link from "next/link";

export const metadata = {
  title: "Términos | Veterinaria El Abrazo",
  description: "Términos de uso y atención de Veterinaria El Abrazo.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF9]">
      <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
          Información legal
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1D3A35] sm:text-4xl">
          Términos de atención
        </h1>
        <div className="mt-8 space-y-6 rounded-2xl border border-[#DCE8E2] bg-white p-6 text-sm leading-7 text-[#5C6F68] sm:p-8">
          <p>
            Las reservas realizadas en Veterinaria El Abrazo están sujetas a disponibilidad de horarios, servicios y profesionales. La confirmación de una cita puede requerir contacto telefónico cuando existan datos incompletos o situaciones clínicas especiales.
          </p>
          <p>
            Te pedimos llegar puntualmente y avisar con anticipación si necesitas reagendar o cancelar. Las urgencias se priorizan según criterio clínico del equipo veterinario.
          </p>
          <p>
            La información publicada sobre servicios, precios y horarios puede actualizarse. Ante dudas específicas, contáctanos antes de reservar.
          </p>
          <Link href="/" className="inline-flex font-semibold text-[#0F766E] transition-colors hover:text-[#0D6B63]">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}