import LoginCard from "@/features/auth/components/LoginCard";
import VetHero from "@/features/auth/components/VetHero";

interface LoginPageProps {
  searchParams: Promise<{
    callbackURL?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackURL = params.callbackURL || "/admin";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6" style={{ background: "linear-gradient(135deg, #E8F4F0 0%, #F0F8F5 40%, #EAF4F1 100%)" }}>
      {/* Paw print decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "#0F766E" }} />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "#2a6a5d" }} />
      </div>
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_24px_80px_-20px_rgba(15,118,110,0.25)] lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch" style={{ borderColor: "#DCE8E2" }}>
        <VetHero />
        <LoginCard callbackURL={callbackURL} />
      </div>
    </main>
  );
}
