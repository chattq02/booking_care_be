-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "bloodPressure" TEXT,
ADD COLUMN     "conclusion" TEXT,
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "heartRate" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "instruction" TEXT,
ADD COLUMN     "medicalHistory" TEXT,
ADD COLUMN     "temperature" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;
