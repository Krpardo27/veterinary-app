interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

/**
 * Tarjeta flotante estilo "post-it clínico" que se apoya sobre la ilustración.
 * className recibe la posición absoluta + rotación desde el componente padre,
 * así este componente no necesita saber dónde vive.
 */
export default function StatCard({ value, label, className = "" }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-[#1B3B36]/80 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-sm ${className}`}
    >
      <p className="text-xl font-bold leading-none text-white">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9FC2BB]">
        {label}
      </p>
    </div>
  );
}
