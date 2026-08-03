"use client";

import LogoutButton from "@/features/auth/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHippo } from "react-icons/fa";
import {
  FiHome,
  FiCalendar,
  FiClock,
  FiUsers,
  FiScissors,
  FiUserCheck,
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
    href: "/admin/veterinarios",
    label: "Veterinarios",
    icon: FiUserCheck,
  },
  {
    href: "/admin/servicios",
    label: "Servicios",
    icon: FiScissors,
  },
  {
    href: "/",
    label: "Sitio Web",
    icon: FaHippo,
    external: true,
  }
];

export default function AdminRoutes() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex flex-col gap-1.5">
      {ADMIN_ROUTES.map((route) => {
        const active = isAdminRouteActive(pathname, route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
