"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiX } from "react-icons/fi";
import { useState } from "react";

import LogoutButton from "@/features/auth/components/LogoutButton";
import { ADMIN_ROUTES, isAdminRouteActive } from "./AdminRoutes";

const PRIMARY_ROUTE_HREFS = [
  "/admin",
  "/admin/agenda",
  "/admin/reservas",
  "/admin/clientes",
];

const MOBILE_LABELS: Record<string, string> = {
  "/admin": "Inicio",
  "/admin/agenda": "Agenda",
  "/admin/reservas": "Reservas",
  "/admin/clientes": "Clientes",
  "/admin/veterinarios": "Equipo",
  "/admin/servicios": "Servicios",
  "/": "Sitio web",
};

export default function AdminMobileDock() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryRoutes = PRIMARY_ROUTE_HREFS.map((href) =>
    ADMIN_ROUTES.find((route) => route.href === href),
  ).filter((route): route is (typeof ADMIN_ROUTES)[number] => Boolean(route));
  const secondaryRoutes = ADMIN_ROUTES.filter(
    (route) => !PRIMARY_ROUTE_HREFS.includes(route.href),
  );
  const secondaryRouteActive = secondaryRoutes.some((route) =>
    isAdminRouteActive(pathname, route.href),
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      {moreOpen && (
        <button
          type="button"
          aria-label="Cerrar opciones"
          onClick={() => setMoreOpen(false)}
          className="fixed inset-0 -z-10 bg-[#1D3A35]/20 backdrop-blur-[2px]"
        />
      )}

      {moreOpen && (
        <div className="mx-auto mb-2 max-w-xl border border-[#B9D9CF] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#E7EFEB] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
              Más opciones
            </p>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              aria-label="Cerrar opciones"
              className="flex size-8 items-center justify-center text-[#52736A] transition-colors hover:bg-[#F0F8F5] hover:text-[#1D554A]"
            >
              <FiX className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3">
            {secondaryRoutes.map((route) => {
              const active = isAdminRouteActive(pathname, route.href);
              const Icon = route.icon;

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMoreOpen(false)}
                  {...(route.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`flex items-center gap-3 border px-3 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "border-[#2A6A5D] bg-[#EAF4F1] text-[#0F766E]"
                      : "border-[#DCE8E2] text-[#1D3A35] hover:bg-[#F0F8F5]"
                  }`}
                >
                  <Icon className="size-4 shrink-0 text-[#0F766E]" />
                  <span className="truncate">{MOBILE_LABELS[route.href] ?? route.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-[#E7EFEB] px-3 pb-3">
            <LogoutButton />
          </div>
        </div>
      )}

      <nav className="mx-auto grid max-w-xl grid-cols-5 border border-[#B9D9CF] bg-white p-1.5 shadow-[0_-8px_28px_rgba(29,58,53,0.14)]">
        {primaryRoutes.map((route) => {
          const active = isAdminRouteActive(pathname, route.href);
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`relative flex min-h-14 flex-col items-center justify-center gap-1 px-0.5 py-1 text-[10px] font-semibold transition-colors ${
                active ? "text-[#0F766E]" : "text-[#6F817A]"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="max-w-full truncate leading-none">
                {MOBILE_LABELS[route.href] ?? route.label}
              </span>
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#2A6A5D]" />}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen((current) => !current)}
          aria-expanded={moreOpen}
          className={`relative flex min-h-14 flex-col items-center justify-center gap-1 px-0.5 py-1 text-[10px] font-semibold transition-colors ${
            moreOpen || secondaryRouteActive ? "text-[#0F766E]" : "text-[#6F817A]"
          }`}
        >
          <FiGrid className="size-4 shrink-0" />
          <span>Más</span>
          {(moreOpen || secondaryRouteActive) && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#2A6A5D]" />}
        </button>
      </nav>
    </div>
  );
}
