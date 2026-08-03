-- CreateEnum
CREATE TYPE "PetSpecies" AS ENUM ('DOG', 'CAT', 'BIRD', 'OTHER');

-- CreateEnum
CREATE TYPE "PetSex" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "petId" TEXT;

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "PetSpecies" NOT NULL,
    "breed" TEXT,
    "sex" "PetSex",
    "birthDate" TIMESTAMP(3),
    "weight" DOUBLE PRECISION,
    "color" TEXT,
    "imageUrl" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pet_customerId_idx" ON "Pet"("customerId");

-- CreateIndex
CREATE INDEX "Pet_species_idx" ON "Pet"("species");

-- CreateIndex
CREATE INDEX "Pet_name_idx" ON "Pet"("name");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
