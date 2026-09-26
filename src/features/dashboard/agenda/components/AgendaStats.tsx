type Props = {
  reservationsCount: number;
  pendingCount: number;
  confirmedCount: number;
  reservationsLabel: string;
};

export default function AgendaStats({
  reservationsCount,
  pendingCount,
  confirmedCount,
  reservationsLabel,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="border border-[#DCE8E2] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">{reservationsLabel}</p>
        <p className="mt-2 text-3xl font-bold text-[#1D3A35]">{reservationsCount}</p>
      </div>
      <div className="border border-[#DCE8E2] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">Pendientes</p>
        <p className="mt-2 text-3xl font-bold text-[#0F766E]">{pendingCount}</p>
      </div>
      <div className="border border-[#DCE8E2] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">Confirmadas</p>
        <p className="mt-2 text-3xl font-bold text-[#1D3A35]">{confirmedCount}</p>
      </div>
    </div>
  );
}
