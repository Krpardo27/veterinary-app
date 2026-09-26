import Link from "next/link";

export const metadata = {
  title: "Privacidad | Veterinaria El Abrazo",
  description: "Política de privacidad de Veterinaria El Abrazo.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF9]">
      <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
          Información legal
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1D3A35] sm:text-4xl">
          Política de privacidad
        </h1>
        <div className="mt-8 space-y-6 rounded-2xl border border-[#DCE8E2] bg-white p-6 text-sm leading-7 text-[#5C6F68] sm:p-8">
          <p>
            En Veterinaria El Abrazo usamos los datos entregados en formularios de reserva y contacto solo para gestionar atenciones, comunicarnos contigo y mantener el historial clínico de tus mascotas.
          </p>
          <p>
            Podemos almacenar nombre, teléfono, correo, datos de mascotas, reservas y notas clínicas necesarias para prestar el servicio veterinario. No vendemos ni cedemos estos datos para fines comerciales externos.
          </p>
          <p>
            Puedes solicitar actualización o eliminación de tus datos escribiendo a contacto@elabrazo.cl. Algunos registros clínicos o administrativos pueden conservarse cuando exista una obligación legal o sanitaria.
          </p>
          <Link href="/" className="inline-flex font-semibold text-[#0F766E] transition-colors hover:text-[#0D6B63]">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}