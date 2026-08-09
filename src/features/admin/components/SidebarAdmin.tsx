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
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-[#E2E8F0] bg-white py-5 transition-[width] duration-200 ease-out lg:flex ${
      expanded ? "w-60 px-3" : "w-20 items-center"
    }`}>
      <div className={`flex w-full flex-1 flex-col ${expanded ? "items-stretch" : "items-center"}`}>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Menú"
          aria-expanded={expanded}
          className={`relative flex h-[42px] items-center rounded-xl text-[#0F766E] ${
            expanded ? "w-full justify-start gap-3 px-3" : "size-[42px] justify-center"
          }`}
        >
          <FiMenu className="size-5" />
          <span className={expanded ? "text-sm font-semibold" : "sr-only"}>Panel clínico</span>
        </button>

        <nav className={`mt-10 ${expanded ? "w-full" : ""}`}>
          <AdminRoutes expanded={expanded} />
        </nav>
      </div>

      <div className={`flex flex-col gap-4 ${expanded ? "items-stretch" : "items-center"}`}>
        <span
          aria-label="Configuración próximamente"
          className={`relative flex h-[42px] rounded-xl text-[#94A3B8] ${
            expanded ? "w-full items-center gap-3 px-3" : "size-[42px] items-center justify-center"
          }`}
        >
          <FiSettings className="size-5" />
          <span className={expanded ? "text-sm font-medium" : "sr-only"}>Configuración</span>
        </span>
        <LogoutButton variant="rail" expanded={expanded} />
        <div
          aria-label={userName || "Administrador"}
          className={`relative flex rounded-xl bg-[#0F766E] text-sm font-bold text-white ${
            expanded ? "h-11 w-full items-center gap-3 px-3" : "size-10 items-center justify-center rounded-full"
          }`}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">{getInitial(userName)}</span>
          <span className={expanded ? "truncate text-sm font-semibold" : "sr-only"}>{userName || "Administrador"}</span>
        </div>
      </div>
    </aside>
  );
}
