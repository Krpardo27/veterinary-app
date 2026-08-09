"use client";

import { useState, type ReactNode } from "react";

import AdminMobileDock from "@/features/admin/components/AdminMobileDock";
import GlobalReservationButton from "@/features/admin/components/GlobalReservationButton";
import SidebarAdmin from "@/features/admin/components/SidebarAdmin";
import type { ProfessionalRole } from "@/features/booking/serviceRoles";
import type { Service } from "@/generated/prisma/client";

type AdminShellProps = {
  children: ReactNode;
  userName: string;
  userEmail: string;
  services: Service[];
  professionals: Array<{
    id: string;
    name: string;
    role: ProfessionalRole;
    serviceIds: string[];
  }>;
};

export default function AdminShell({
  children,
  userName,
  userEmail,
  services,
  professionals,
}: AdminShellProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-dvh bg-[#F8FAFC] text-[#0F172A]">
      <SidebarAdmin
        userName={userName}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((expanded) => !expanded)}
      />
      <main
        className={`min-h-dvh transition-[padding] duration-200 ease-out ${
          sidebarExpanded ? "lg:pl-60" : "lg:pl-20"
        }`}
      >
        <section
          id="admin-content"
          className="container mx-auto min-h-dvh bg-[#F8FAFC] p-4 pb-28 md:p-8 md:pb-24 lg:pb-8"
        >
          <header className="mb-8 flex flex-col gap-4 border-b border-[#E2E8F0] pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
                Luma Vet · Administración
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
                Panel clínico
              </h1>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] py-1.5 pl-1.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F766E] text-xs font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#0F172A]">{userName}</p>
                <p className="text-[11px] text-[#64748B]">{userEmail}</p>
              </div>
            </div>
          </header>

          <div className="w-full">{children}</div>
        </section>
      </main>
      <GlobalReservationButton services={services} professionals={professionals} />
      <AdminMobileDock />
    </div>
  );
}