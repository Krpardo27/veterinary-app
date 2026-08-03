import Link from "next/link";
import { FiShield } from "react-icons/fi";
import GoogleSignInButton from "./GoogleSignInButton";

interface LoginCardProps {
  callbackURL: string;
}

export default function LoginCard({ callbackURL }: LoginCardProps) {
  return (
    <section className="relative bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--primary)]">
          VetCare
        </p>
        <Link
          href="/"
          className="text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          Inicio
        </Link>
      </div>

      <div className="mx-auto flex min-h-105 max-w-sm flex-col justify-center pt-6 lg:pt-10">
        <div className="mb-8 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]">
            <FiShield className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted)]">
            Ficha de acceso
          </p>
          <div>
            <p className="mt-2 text-md leading-relaxed text-[var(--muted)]">
              Ingresa con tu cuenta autorizada para gestionar la clínica
              veterinaria.
            </p>
          </div>
        </div>

        <GoogleSignInButton callbackURL={callbackURL} className="h-12 w-full" />

        <div className="mt-6 flex items-center justify-center gap-2">
          <StampBadge />
          <p className="text-center text-xs leading-relaxed text-[var(--muted)]">
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