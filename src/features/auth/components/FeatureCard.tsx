import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  label: string;
}

export default function FeatureCard({ icon, label }: FeatureCardProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#F2B705]/30 bg-white/5 p-4 text-xs transition-colors hover:bg-white/10">
      <span className="text-[#F2B705]">{icon}</span>
      {label}
    </div>
  );
}
