/*
  Warnings:

  - Added the required column `appointmentDate` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "appointmentDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_idx" ON "appointments"("appointmentDate");

-- CreateIndex
CREATE INDEX "appointments_patientId_appointmentDate_idx" ON "appointments"("patientId", "appointmentDate");
