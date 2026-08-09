"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CgWebsite } from "react-icons/cg";
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
    label: "Profesionales",
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
    icon: CgWebsite,
    external: true,
  }
];

export default function AdminRoutes({ expanded = false }: { expanded?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col gap-3 ${expanded ? "items-stretch" : "items-center"}`}>
      {ADMIN_ROUTES.map((route) => {
        const active = isAdminRouteActive(pathname, route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={route.label}
            className={`relative flex h-[42px] items-center rounded-xl transition-colors ${
              expanded ? "w-full justify-start gap-3 px-3" : "size-[42px] justify-center"
            } ${
              active
                ? "bg-[#D1FAE5] text-[#0F766E]"
                : "text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F766E]"
            }`}
          >
            <route.icon className="size-5" />
            <span className={expanded ? "text-sm font-medium" : "sr-only"}>{route.label}</span>
            {active && <span className={`absolute h-5 w-0.5 rounded-l bg-[#0F766E] ${expanded ? "-right-3" : "-right-5"}`} />}
          </Link>
        );
      })}
    </div>
  );
}
