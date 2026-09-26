"use client";

import AdminRoutes from "@/features/admin/components/AdminRoutes";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { FiMenu, FiSettings } from "react-icons/fi";

type SidebarAdminProps = {
  userName?: string | null;
  expanded: boolean;
  onToggle: () => void;
};

function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "A";
}

export default function SidebarAdmin({
  userName,
  expanded,
  onToggle,
}: SidebarAdminProps) {
  const railItemClass = expanded
    ? "w-full justify-start gap-3 px-3"
    : "w-10.5 justify-center px-0";
  const labelClass = expanded
    ? "max-w-36 opacity-100"
    : "max-w-0 opacity-0";

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-[#E2E8F0] bg-white py-5 transition-[width] duration-200 ease-out lg:flex ${
      expanded ? "w-60 px-3" : "w-20 px-0"
    }`}>
      <div className="flex w-full flex-1 flex-col items-center">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Menú"
          aria-expanded={expanded}
          className={`relative flex h-10.5 cursor-pointer items-center overflow-hidden rounded-xl text-[#0F766E] transition-[width,background-color,color,box-shadow] duration-200 ease-out hover:bg-[#F0FDF4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 ${railItemClass}`}
        >
          <FiMenu className="size-5 shrink-0" />
          <span className={`whitespace-nowrap text-sm font-semibold transition-[max-width,opacity] duration-150 ease-out ${labelClass}`}>
            Panel clínico
          </span>
        </button>

        <nav className="mt-10 w-full">
          <AdminRoutes expanded={expanded} />
        </nav>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <span
          aria-label="Configuración próximamente"
          title="Configuración próximamente"
          className={`relative flex h-10.5 items-center overflow-hidden rounded-xl text-[#94A3B8] transition-[width] duration-200 ease-out ${railItemClass}`}
        >
          <FiSettings className="size-5 shrink-0" />
          <span className={`whitespace-nowrap text-sm font-medium transition-[max-width,opacity] duration-150 ease-out ${labelClass}`}>
            Configuración
          </span>
        </span>
        <LogoutButton variant="rail" expanded={expanded} />
        <div
          aria-label={userName || "Administrador"}
          className={`relative flex h-11 items-center overflow-hidden rounded-xl bg-[#0F766E] text-sm font-bold text-white transition-[width,border-radius] duration-200 ease-out ${expanded ? "w-full gap-3 px-3" : "w-10 justify-center px-0 rounded-full"}`}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">{getInitial(userName)}</span>
          <span className={`truncate whitespace-nowrap text-sm font-semibold transition-[max-width,opacity] duration-150 ease-out ${labelClass}`}>
            {userName || "Administrador"}
          </span>
        </div>
      </div>
    </aside>
  );
}
