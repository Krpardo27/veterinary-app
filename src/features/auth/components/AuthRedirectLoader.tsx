"use client";

import { getSafeCallbackPath } from "@/lib/auth-client";
import LoaderScreen from "@/shared/ui/LoaderScreen";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirectLoader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = getSafeCallbackPath(searchParams.get("callbackURL"), "/admin");

  useEffect(() => {
    router.replace(callbackURL);
  }, [callbackURL, router]);

  return (
    <LoaderScreen
      badgeText="Acceso seguro"
      title="Iniciando sesión"
      description="Estamos preparando tu panel de administración."
    />
  );
}