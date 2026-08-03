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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EFEAE0] px-4 py-10 text-[#1F2A24] sm:px-6">
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-[#E2E8F0] bg-white shadow-[0_20px_70px_-25px_rgba(15,118,110,0.2)] lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <VetHero />
        <LoginCard callbackURL={callbackURL} />
      </div>
    </main>
  );
}
