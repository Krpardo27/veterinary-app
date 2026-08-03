"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex h-11 cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0D6B63] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <FiArrowLeft className="h-4 w-4" />
      Volver
    </button>
  );
}
