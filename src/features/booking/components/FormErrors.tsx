"use client";

import { useEffect, useRef, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";

export default function FormErrors({
  children,
}: {
  children: React.ReactNode;
}) {
  const errorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const form = errorRef.current?.closest("form");

    if (!form) return;

    const hideError = () => setIsVisible(false);
    const showError = () => setIsVisible(true);

    form.addEventListener("input", hideError, true);
    form.addEventListener("change", hideError, true);
    form.addEventListener("submit", showError, true);

    return () => {
      form.removeEventListener("input", hideError, true);
      form.removeEventListener("change", hideError, true);
      form.removeEventListener("submit", showError, true);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={errorRef}
      role="alert"
      aria-live="polite"
      className="
        flex items-start gap-3
        rounded-xl mt-2
        border border-red-200
        border-l-4 border-l-red-500
        bg-red-50
        p-2
        text-red-700
        shadow-sm
      "
    >
      <IoWarningOutline
        className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
        aria-hidden="true"
      />

      <div className="space-y-1">
        <p className="font-semibold text-red-800">
          Ocurrió un error
        </p>
        <p className="text-xs leading-5">
          {children}
        </p>
      </div>
    </div>
  );
}