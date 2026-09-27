"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import { FaArrowUp, FaPaw } from "react-icons/fa";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let animationFrameId = 0;

    const syncScrollState = () => {
      const currentScrollY = window.scrollY;
      const didScroll = currentScrollY !== lastScrollY.current;

      if (didScroll) {
        const isNearTop = currentScrollY < 24;
        const isScrollingUp = currentScrollY < lastScrollY.current;

        setIsVisible(isNearTop || isScrollingUp);
        setShowScrollTop(currentScrollY > 420);
        lastScrollY.current = currentScrollY;
      }

      animationFrameId = window.requestAnimationFrame(syncScrollState);
    };

    animationFrameId = window.requestAnimationFrame(syncScrollState);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  const scrollToTop = () => {
    setIsVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-[#dce8e2] bg-[#f5f7f2]/90 backdrop-blur transition-transform duration-300 md:translate-y-0 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-[#1d3a35]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a6a5d] text-white shadow-lg shadow-[#2a6a5d]/20 md:h-11 md:w-11">
              <FaPaw className="text-lg" />
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight md:text-lg">Veterinaria El Abrazo</p>
              <p className="hidden text-sm text-[#5c6f68] sm:block">
                Cuidado atento para cada mascota
              </p>
            </div>
          </Link>
          <Navbar />
        </div>
      </header>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className={`fixed bottom-5 cursor-pointer right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#dce8e2] bg-white text-[#1d3a35] shadow-lg shadow-[#1d3a35]/12 transition duration-200 hover:border-[#2a6a5d]/40 hover:text-[#2a6a5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a6a5d]/30 ${
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <FaArrowUp className="h-4 w-4" />
      </button>
    </>
  );
}
