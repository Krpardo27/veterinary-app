"use client";

import AdminRoutes from "@/features/admin/components/AdminRoutes";

type SidebarAdminProps = {
  userName?: string | null;
  userEmail?: string | null;
  roleLabel?: string;
};

function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "A";
}

export default function SidebarAdmin({
  userName,
  userEmail,
  roleLabel = "Administrador",
}: SidebarAdminProps) {
  return (
    <aside className="hidden self-start rounded-3xl bg-[#FFFFFF] p-5 drop-shadow-2xl lg:sticky lg:top-4 lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="mb-5 border-b border-zinc-200 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-[#0F172A]">
            Administrador
          </h2>

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.28em] text-[#64748B]">
            Panel clínico
          </p>
        </div>

        <nav className="space-y-1">
          <AdminRoutes />
        </nav>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E] text-sm font-bold text-white">
            {getInitial(userName)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#0F172A]">
              {userName || "Administrador"}
            </p>
            <p className="truncate text-xs text-[#64748B]" title={userEmail ?? ""}>
              {userEmail || "Sin correo"}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-[#0F766E]">
            {roleLabel}
          </span>
        </div>
      </div>
    </aside>
  );
}
