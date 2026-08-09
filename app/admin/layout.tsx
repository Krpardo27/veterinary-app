import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminMobileDock from "@/features/admin/components/AdminMobileDock";
import SidebarAdmin from "@/features/admin/components/SidebarAdmin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login?callbackURL=/admin");
  }

  const displayName = session.user.name?.trim() || "Administrador";
  const displayEmail = session.user.email ?? "Sin correo registrado";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto grid w-full grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_1fr] lg:gap-6">
        <SidebarAdmin userName={displayName} userEmail={displayEmail} />
        <section
          id="admin-content"
          className="min-h-[calc(100vh-2rem)] rounded-[1.75rem] border border-[#E2E8F0] bg-white p-4 pb-24 shadow-lg md:p-8 md:pb-24 lg:pb-8"
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
                {displayName.charAt(0).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#0F172A]">
                  {displayName}
                </p>
                <p className="text-[11px] text-[#64748B]">{displayEmail}</p>
              </div>
            </div>
          </header>

          <div className="w-full">{children}</div>
        </section>
      </div>
      <AdminMobileDock />
    </div>
  );
}
