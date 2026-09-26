-- AlterTable
ALTER TABLE "WeightRecord" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Reservation_veterinarianId_status_startAt_endAt_idx" ON "Reservation"("veterinarianId", "status", "startAt", "endAt");
