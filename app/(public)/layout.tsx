import type { ReactNode } from "react";
import type { Metadata } from "next";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

export const metadata: Metadata = {
  title: "Luma Vet | Clínica Veterinaria Moderna",
  description:
    "Clínica veterinaria integral con atención personalizada, diagnóstico avanzado y seguimiento cercano para el bienestar de tu mascota.",
  keywords: [
    "veterinaria",
    "clínica veterinaria",
    "cuidado de mascotas",
    "consulta veterinaria",
    "vacunación",
    "cirugía veterinaria",
  ],
  openGraph: {
    title: "Luma Vet | Clínica Veterinaria Moderna",
    description:
      "Cuidado integral para tu mascota con medicina preventiva, hospitalización y atención personalizada.",
    type: "website",
  },
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
