import Link from "next/link";

import FormErrors from "@/features/admin/components/FormErrors";
import { formatLongDate } from "@/utils/dateFormatters";

type Props = {
  activeDate: string;
  today: string;
  tomorrow: string;
  isUpcomingView: boolean;
  selectedDate: Date;
  dateError?: string;
};

function navLinkClass(isActive: boolean) {
  return `border px-3 py-2 text-xs font-semibold transition-colors ${isActive ? "border-[#2A6A5D] bg-[#2A6A5D] text-white" : "border-[#B9D9CF] text-[#1D554A] hover:bg-[#F0F8F5]"}`;
}

export default function AgendaHeader({
  activeDate,
  today,
  tomorrow,
  isUpcomingView,
  selectedDate,
  dateError,
}: Props) {
  const isTodayActive = !isUpcomingView && activeDate === today;
  const isTomorrowActive = !isUpcomingView && activeDate === tomorrow;

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
            Operación diaria
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1D3A35]">
            Agenda
          </h2>
          <p className="mt-2 text-sm text-[#5C6F68]">
            {isUpcomingView ? "Próximas reservas activas" : formatLongDate(selectedDate)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/agenda?date=${today}`} aria-current={isTodayActive ? "page" : undefined} className={navLinkClass(isTodayActive)}>
            Hoy
          </Link>
          <Link href={`/admin/agenda?date=${tomorrow}`} aria-current={isTomorrowActive ? "page" : undefined} className={navLinkClass(isTomorrowActive)}>
            Mañana
          </Link>
          <Link href="/admin/agenda?view=upcoming" aria-current={isUpcomingView ? "page" : undefined} className={navLinkClass(isUpcomingView)}>
            Próximas
          </Link>
        </div>
      </header>

      <form noValidate className="flex flex-col gap-3 border border-[#DCE8E2] bg-[#F7FAF9] p-4 sm:flex-row sm:items-end">
        <div>
          <label htmlFor="agenda-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Fecha
          </label>
          <input id="agenda-date" name="date" type="date" defaultValue={activeDate} className="border border-[#DCE8E2] bg-white px-3 py-2 text-sm text-[#1D3A35] outline-none focus:border-[#2A6A5D]" />
          {dateError && <FormErrors>{dateError}</FormErrors>}
        </div>
        <button type="submit" className="bg-[#2A6A5D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D554A]">
          Ver agenda
        </button>
      </form>
    </>
  );
}
