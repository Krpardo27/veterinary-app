import { scheduleItems } from "../data";

export default function ScheduleCard() {
  return (
    <div className="rounded-[1.5rem] bg-white/10 p-6 backdrop-blur">
      <p className="text-lg font-semibold">Horario de atención</p>
      <ul className="mt-4 space-y-3 text-sm text-[#e6f2ee]">
        {scheduleItems.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}