import ScheduleCard from "./ScheduleCard";
import { teamCopy } from "../data";

export default function TeamSection() {
  return (
    <section id="equipo" className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
      <div className="rounded-[2rem] border border-[#e3d8c0] bg-[#23423a] px-8 py-10 text-white shadow-[0_25px_60px_-25px_rgba(35,66,58,0.7)] lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#e1c291]">
              {teamCopy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">{teamCopy.title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#dce9e4]">
              {teamCopy.description}
            </p>
          </div>
          <ScheduleCard />
        </div>
      </div>
    </section>
  );
}