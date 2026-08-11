import PetHealthForms from "./PetHealthForms";
import PetHealthHistory from "./PetHealthHistory";

type WeightRecord = {
  id: string;
  weight: number;
  measuredAt: Date;
  notes: string | null;
};

type Vaccination = {
  id: string;
  vaccineName: string;
  appliedAt: Date;
  nextDueAt: Date | null;
  notes: string | null;
};

type PetHealthSectionProps = {
  petId: string;
  weightRecords: WeightRecord[];
  vaccinations: Vaccination[];
};

export default function PetHealthSection({
  petId,
  weightRecords,
  vaccinations,
}: PetHealthSectionProps) {
  return (
    <section className="border border-[#DCE8E2] bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#52736A]">
            Salud
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#1D3A35]">Peso y vacunas</h2>
        </div>
        <PetHealthForms petId={petId} />
      </div>

      <PetHealthHistory
        petId={petId}
        weightRecords={weightRecords}
        vaccinations={vaccinations}
      />
    </section>
  );
}
