"use client";

import { signOut } from "@/lib/auth-client";
import LoaderScreen from "@/shared/ui/LoaderScreen";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { COLORS } from "@/shared/constants/theme";

interface LogoutButtonProps {
  callbackURL?: string;
  variant?: "sidebar" | "dock" | "rail";
  expanded?: boolean;
}

const LOGOUT_REDIRECT_DELAY_MS = 700;

export default function LogoutButton({
  callbackURL = "/auth/login",
  variant = "sidebar",
  expanded = false,
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.setTimeout(() => {
              window.location.href = callbackURL;
            }, LOGOUT_REDIRECT_DELAY_MS);
          },
        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Logout Error:", error);
    }
  }

  const loader = loading ? (
    <LoaderScreen
      mode="overlay"
      badgeText="Sesión"
      title="Cerrando sesión"
      description="Hasta pronto. Tu sesión ha sido cerrada con seguridad."
    />
  ) : null;

  if (variant === "rail") {
    const railItemClass = expanded
      ? "w-full justify-start gap-3 px-3"
      : "w-10.5 justify-center px-0";
    const labelClass = expanded
      ? "max-w-36 opacity-100"
      : "max-w-0 opacity-0";

    return (
      <>
        {loader}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          aria-label="Cerrar sesión"
          className={`relative flex h-10.5 cursor-pointer items-center overflow-hidden rounded-xl transition-[width,background-color,color] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 ${railItemClass}`}
          style={{ color: COLORS.text_muted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primary_bg;
            e.currentTarget.style.color = COLORS.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = COLORS.text_muted;
          }}
        >
          <FiLogOut className="size-5 shrink-0" />
          <span className={`whitespace-nowrap text-sm font-medium transition-[max-width,opacity] duration-150 ease-out ${labelClass}`}>
            Cerrar sesión
          </span>
        </button>
      </>
    );
  }

  if (variant === "dock") {
    return (
      <>
        {loader}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="group relative flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1 text-[9px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 min-[390px]:text-[10px]"
          style={{ color: COLORS.text_muted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.primary; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.text_muted; }}
        >
          <FiLogOut className="h-4 w-4 shrink-0" />
          <span className="leading-none">Salir</span>
          <span
            className="absolute inset-x-1/2 bottom-1 h-0.5 rounded-full opacity-0 transition-all duration-300 ease-out group-hover:inset-x-4 group-hover:opacity-100"
            style={{ backgroundColor: COLORS.primary }}
          />
        </button>
      </>
    );
  }

  return (
    <>
      {loader}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="relative mt-3 flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
        style={{ backgroundColor: COLORS.primary_bg, color: COLORS.secondary }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#D4EDE7"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.primary_bg; }}
      >
        <FiLogOut className="h-4 w-4 shrink-0" />
        Cerrar sesión
      </button>
    </>
  );
}
