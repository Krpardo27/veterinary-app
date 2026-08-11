import Link from "next/link";
import { FaPaw } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import GoogleSignInButton from "./GoogleSignInButton";
import { COLORS } from "@/shared/constants/theme";

interface LoginCardProps {
  callbackURL: string;
}

export default function LoginCard({ callbackURL }: LoginCardProps) {
  return (
    <section className="relative bg-white p-6 sm:p-8 lg:p-10">
      {/* Mobile nav */}
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <FaPaw className="h-4 w-4" style={{ color: COLORS.primary }} />
          <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: COLORS.primary }}>
            Luma Vet
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-semibold transition-colors hover:underline"
          style={{ color: COLORS.text_muted }}
        >
          Ir al sitio
        </Link>
      </div>

      <div className="mx-auto flex min-h-[420px] max-w-sm flex-col justify-center pt-6 lg:pt-10">
        {/* Icon + título */}
        <div className="mb-8 space-y-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: COLORS.primary_bg, border: `1.5px solid ${COLORS.border}` }}
          >
            <FiShield className="h-6 w-6" style={{ color: COLORS.primary }} />
          </div>

          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: COLORS.accent }}
            >
              Portal clínico
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight" style={{ color: COLORS.dark }}>
              Bienvenido de vuelta
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: COLORS.text_muted }}>
              Ingresa con tu cuenta autorizada para gestionar la clínica veterinaria.
            </p>
          </div>
        </div>

        {/* Separador decorativo */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: COLORS.border }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: COLORS.text_muted }}>
            Acceso seguro
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: COLORS.border }} />
        </div>

        <GoogleSignInButton callbackURL={callbackURL} className="h-12 w-full" />

        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl p-3" style={{ backgroundColor: COLORS.primary_bg }}>
          <StampBadge />
          <p className="text-xs leading-relaxed" style={{ color: COLORS.text_muted }}>
            Solo cuentas con rol autorizado pueden ingresar.
          </p>
        </div>
      </div>
    </section>
  );
}

function ClipIcon() {
  return (
    <svg width="56" height="60" viewBox="0 0 56 60" aria-hidden="true">
      <rect
        x="18"
        y="0"
        width="20"
        height="40"
        rx="10"
        fill="none"
        stroke="var(--border)"
        strokeWidth="5"
      />
      <rect
        x="10"
        y="26"
        width="36"
        height="16"
        rx="8"
        fill="var(--secondary)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StampBadge() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className="shrink-0 text-[var(--primary)]"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.5 2.5"
      />
      <path
        d="M6 10.5 L9 13.5 L14 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}