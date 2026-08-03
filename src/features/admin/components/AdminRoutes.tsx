"use client";

import LogoutButton from "@/features/auth/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiClock,
  FiUsers,
  FiScissors,
  FiArchive,
  FiUserCheck,
  FiBriefcase,
  FiShield,
  FiSettings,
} from "react-icons/fi";

export function isAdminRouteActive(pathname: string, routeHref: string) {
  if (routeHref === "/admin") {
    return pathname === "/admin";
  }

  return pathname === routeHref || pathname.startsWith(`${routeHref}/`);
}


export const ADMIN_ROUTES = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: FiHome,
  },
  {
    href: "/admin/reservas",
    label: "Reservas",
    icon: FiCalendar,
  },
  {
    href: "/admin/agenda",
    label: "Agenda",
    icon: FiClock,
  },
  {
    href: "/admin/clientes",
    label: "Clientes",
    icon: FiUsers,
  },
  {
    href: "/admin/servicios",
    label: "Servicios",
    icon: FiScissors,
    requiresCatalogAccess: true,
  },
  {
    href: "/admin/barberos",
    label: "Barberos",
    icon: FiUserCheck,
    requiresCatalogAccess: true,
  },
  {
    href: "/admin/configuracion",
    label: "Configuración",
    icon: FiSettings,
    requiresCatalogAccess: true,
    tenantOnly: true,
  },
  {
    href: "/admin/barberias",
    label: "Barberías",
    icon: FiBriefcase,
    platformOnly: true,
  },
  {
    href: "/admin/auditoria",
    label: "Auditoría",
    icon: FiShield,
    platformOnly: true,
  },
];

export default function AdminRoutes({
  showPlatformRoutes = false,
  canManageCatalog = false,
}: {
  showPlatformRoutes?: boolean;
  canManageCatalog?: boolean;
}) {
  const pathname = usePathname();
  const routes = ADMIN_ROUTES.filter((route) => {
    if (route.platformOnly && !showPlatformRoutes) return false;
    if (route.requiresCatalogAccess && !canManageCatalog) return false;
    if (route.tenantOnly && showPlatformRoutes) return false;
    return true;
  });

  return (
    <nav className="mt-4 flex flex-col gap-1.5">
      {routes.map((route) => {
        const active = isAdminRouteActive(pathname, route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={
              active
                ? "relative rounded-xl bg-[#0F766E] py-2 pl-4 pr-3 text-sm font-semibold text-white"
                : "relative rounded-xl py-2 pl-4 pr-3 text-sm text-[#64748B] transition-colors hover:bg-[#D1FAE5] hover:text-[#0F766E]"
            }
          >
            <span
              className={
                active
                  ? "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-[#38BDF8]"
                  : "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-transparent"
              }
            />

            <span className="flex items-center gap-3">
              <route.icon className="h-4 w-4" />
              {route.label}
            </span>
          </Link>
        );
      })}

      <LogoutButton />
    </nav>
  );
}