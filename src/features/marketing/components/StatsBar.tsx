import { COLORS } from "@/shared/constants/theme";

const stats = [
  { value: "+8 años", label: "de experiencia clínica" },
  { value: "+1.200", label: "mascotas atendidas" },
  { value: "98%", label: "dueños satisfechos" },
  { value: "5", label: "profesionales certificados" },
];

export default function StatsBar() {
  return (
    <section
      className="border-y py-10"
      style={{ borderColor: COLORS.border, backgroundColor: COLORS.primary_bg }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <p className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: COLORS.primary }}>
                {stat.value}
              </p>
              <p className="mt-1 text-sm" style={{ color: COLORS.text }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
