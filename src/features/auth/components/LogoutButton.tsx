"use client";

import { signOut } from "@/lib/auth-client";
import LoaderScreen from "@/shared/ui/LoaderScreen";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

interface LogoutButtonProps {
  callbackURL?: string;
  variant?: "sidebar" | "dock";
}

const LOGOUT_REDIRECT_DELAY_MS = 700;

export default function LogoutButton({
  callbackURL = "/auth/login",
  variant = "sidebar",
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
      description="Estamos saliendo del panel de administración."
    />
  ) : null;

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
          className="group relative flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1 text-[9px] font-medium text-red-400 transition-colors hover:text-red-300 disabled:pointer-events-none disabled:opacity-50 min-[390px]:text-[10px]"
        >
          <FiLogOut className="h-4 w-4 shrink-0" />
          <span className="leading-none">Salir</span>
          <span className="absolute inset-x-1/2 bottom-1 h-0.5 rounded-full bg-red-400/80 opacity-0 transition-all duration-300 ease-out group-hover:inset-x-4 group-hover:opacity-100" />
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
        className="relative mt-3 cursor-pointer rounded-lg bg-white/5 py-2 pl-4 pr-3 text-left text-sm text-zinc-400 transition-colors hover:bg-[#D1FAE5] hover:text-[#0F766E] disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="flex items-center gap-3">
          <FiLogOut className="h-4 w-4" />
          Cerrar sesión
        </span>
      </button>
    </>
  );
}