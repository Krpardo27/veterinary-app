import type { ReactNode } from "react";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
