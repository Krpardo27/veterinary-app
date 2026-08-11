import { COLORS, TYPOGRAPHY } from "@/shared/constants/theme";

export default function TeamHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          backgroundColor: COLORS.primary_subtle,
          color: COLORS.primary,
        }}
      >
        🩺 Nuestro equipo
      </span>
      <h2 className={`mt-4 ${TYPOGRAPHY.heading_lg}`} style={{ color: COLORS.darker }}>
        Veterinarios que cuidan a tu mascota
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed" style={{ color: COLORS.text_muted }}>
        Profesionales certificados, especializados en distintas áreas del bienestar animal.
      </p>
    </div>
  );
}
