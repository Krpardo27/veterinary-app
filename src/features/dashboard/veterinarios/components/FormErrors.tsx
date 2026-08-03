import { IoWarningOutline } from "react-icons/io5";

export default function FormErrors({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
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
        <p className="font-semibold text-red-800">Ocurrió un error</p>
        <p className="text-xs leading-5">{children}</p>
      </div>
    </div>
  );
}
