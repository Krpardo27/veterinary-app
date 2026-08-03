import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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
  const displayEmail = session.user.email ?? "Sin correo";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_1fr] lg:gap-6">
        <SidebarAdmin userName={displayName} userEmail={displayEmail} />

        <section className="min-h-[calc(100vh-2rem)] rounded-[1.75rem] border border-[#E2E8F0] bg-[#FFFFFF] p-4 pb-[calc(8.5rem+env(safe-area-inset-bottom))] shadow-[0_20px_70px_-25px_rgba(15,118,110,0.18)] md:p-8 lg:pb-10">
          <header className="mb-8 border-b border-[#E2E8F0] pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                  Panel clínico
                </h1>
              </div>
            </div>
          </header>
          <div className="w-full">{children}</div>
        </section>
      </div>
    </div>
  );
}
