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
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      {moreOpen && (
        <button
          type="button"
          aria-label="Cerrar opciones"
          onClick={() => setMoreOpen(false)}
          className="fixed inset-0 -z-10 bg-[#102C27]/20 backdrop-blur-sm"
        />
      )}

      {moreOpen && (
        <section
          id="admin-more-options"
          aria-label="Más opciones de administración"
          className="mx-auto mb-3 max-w-xl overflow-hidden border-y border-[#D8E6E0] bg-[#FFFEFC]/95 shadow-[0_-14px_40px_rgba(21,57,50,0.16)] backdrop-blur-2xl"
        >
          <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-[#B6C9C1]" />
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#52736A]">
              Más opciones
            </p>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              aria-label="Cerrar opciones"
              className="flex size-11 items-center justify-center rounded-full bg-[#EAF3EF] text-[#315D53] transition-colors active:scale-95"
            >
              <FiX className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 px-3 pb-4">
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
                  className={`flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl px-2 py-3 text-center text-[11px] font-semibold transition-colors active:scale-[0.97] ${
                    active
                      ? "bg-[#DDF2EB] text-[#0A6B5D]"
                      : "text-[#294B43] hover:bg-[#F2F7F4]"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="max-w-full truncate">{MOBILE_LABELS[route.href] ?? route.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-[#E3ECE8] px-4 pb-3 pt-2">
            <LogoutButton />
          </div>
        </section>
      )}

      <nav
        aria-label="Navegación principal de administración"
        className="grid grid-cols-5 border-t border-[#D8E6E0] bg-[#FFFEFC]/90 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_24px_rgba(21,57,50,0.09)] backdrop-blur-2xl"
      >
        {primaryRoutes.map((route) => {
          const active = isAdminRouteActive(pathname, route.href);
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setMoreOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-1 px-1 py-1 text-[10px] font-semibold transition-colors active:scale-95 ${
                active ? "text-[#0A6B5D]" : "text-[#6C8279]"
              }`}
            >
              <Icon className={`size-5 shrink-0 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="max-w-full truncate leading-none">
                {MOBILE_LABELS[route.href] ?? route.label}
              </span>
              {active && <span className="absolute bottom-0 h-1 w-1 rounded-full bg-[#0A6B5D]" />}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen((current) => !current)}
          aria-expanded={moreOpen}
          aria-controls="admin-more-options"
          className={`relative flex min-h-12 flex-col items-center justify-center gap-1 px-1 py-1 text-[10px] font-semibold transition-colors active:scale-95 ${
            moreOpen || secondaryRouteActive ? "text-[#0A6B5D]" : "text-[#6C8279]"
          }`}
        >
          <FiGrid className="size-5 shrink-0" />
          <span>Más</span>
          {(moreOpen || secondaryRouteActive) && <span className="absolute bottom-0 h-1 w-1 rounded-full bg-[#0A6B5D]" />}
        </button>
      </nav>
    </div>
  );
}
