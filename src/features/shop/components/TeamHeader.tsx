import { COLORS } from "@/shared/constants/theme";
import Heading from "@/shared/ui/Heading";
import SectionEyebrow from "@/shared/ui/SectionEyebrow";

export default function TeamHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <SectionEyebrow>
        🩺 Nuestro equipo
      </SectionEyebrow>
      <Heading level={2} className="mt-4" style={{ color: COLORS.darker }}>
        Veterinarios que cuidan a tu mascota
      </Heading>
      <p className="mt-3 text-[15px] leading-relaxed" style={{ color: COLORS.text_muted }}>
        Profesionales certificados, especializados en distintas áreas del bienestar animal.
      </p>
    </div>
  );
}
