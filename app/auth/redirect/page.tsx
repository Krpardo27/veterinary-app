import AuthRedirectLoader from "@/features/auth/components/AuthRedirectLoader";
import LoaderScreen from "@/shared/ui/LoaderScreen";
import { Suspense } from "react";

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <LoaderScreen
          badgeText="Acceso seguro"
          title="Iniciando sesión"
          description="Estamos preparando tu panel de administración."
        />
      }
    >
      <AuthRedirectLoader />
    </Suspense>
  );
}