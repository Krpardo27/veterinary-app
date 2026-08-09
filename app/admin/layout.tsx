import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/features/admin/components/AdminShell";

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
  const [services, professionals] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.professional.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        services: {
          where: { isActive: true },
          select: { serviceId: true },
        },
      },
    }),
  ]);

  return (
    <AdminShell
      userName={displayName}
      userEmail={displayEmail}
      services={services}
      professionals={professionals.map(({ services: assignedServices, ...professional }) => ({
        ...professional,
        serviceIds: assignedServices.map((service) => service.serviceId),
      }))}
    >
      {children}
    </AdminShell>
  );
}
