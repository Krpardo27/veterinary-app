-- CreateEnum
CREATE TYPE "ProfessionalRole" AS ENUM ('VETERINARY', 'GROOMING');

-- AlterTable
ALTER TABLE "Veterinarian" ADD COLUMN     "role" "ProfessionalRole" NOT NULL DEFAULT 'VETERINARY';
