import Link from "next/link";
import type { IconType } from "react-icons";

export type DashboardStat = {
  label: string;
  value: string | number;
  icon: IconType;
  href: string;
};

type DashboardStatGridProps = {
  stats: DashboardStat[];
};

export default function DashboardStatGrid({ stats }: DashboardStatGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Link key={stat.label} href={stat.href}>
            <div className="group cursor-pointer rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)] transition-all hover:border-[#0F766E]/30">
              <div className="mb-3 inline-flex rounded-lg bg-[#D1FAE5] p-2">
                <Icon className="h-5 w-5 text-[#0F766E]" />
              </div>
              <p className="text-sm text-[#64748B] transition-colors group-hover:text-[#0F766E]">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stat.value}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}