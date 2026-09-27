import { COLORS } from "@/shared/constants/theme";
import Heading from "@/shared/ui/Heading";

export default function TeamHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Heading level={3}>🩺 Nuestro equipo</Heading>
      <Heading level={2} className="mt-4" style={{ color: COLORS.darker }}>
        Profesionales que cuidan a tu mascota
      </Heading>
      <p
        className="mt-3 text-[15px] leading-relaxed"
        style={{ color: COLORS.text_muted }}
      >
        Veterinaria, peluquería y baño reunidos en un equipo coordinado para el
        bienestar animal.
      </p>
    </div>
  );
}
