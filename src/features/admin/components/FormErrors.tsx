export default function FormErrors({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-red-500">{children}</p>;
}
