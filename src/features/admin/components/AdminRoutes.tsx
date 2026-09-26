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
  const itemClass = expanded
    ? "w-full justify-start gap-3 px-3"
    : "w-10.5 justify-center px-0";
  const labelClass = expanded
    ? "max-w-36 opacity-100"
    : "max-w-0 opacity-0";

  return (
    <div className="flex flex-col items-center gap-3 px-0">
      {ADMIN_ROUTES.map((route) => {
        const active = isAdminRouteActive(pathname, route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={route.label}
            aria-current={active && !route.external ? "page" : undefined}
            className={`relative flex h-10.5 items-center overflow-hidden rounded-xl transition-[width,background-color,color] duration-200 ease-out ${itemClass} ${
              active
                ? "bg-[#D1FAE5] text-[#0F766E]"
                : "text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F766E]"
            }`}
          >
            <route.icon className="size-5 shrink-0" />
            <span className={`whitespace-nowrap text-sm font-medium transition-[max-width,opacity] duration-150 ease-out ${labelClass}`}>
              {route.label}
            </span>
            {active && <span className={`absolute h-5 w-0.5 rounded-l bg-[#0F766E] ${expanded ? "-right-3" : "-right-5"}`} />}
          </Link>
        );
      })}
    </div>
  );
}
