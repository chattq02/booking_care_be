/*
  Warnings:

  - Added the required column `facilityId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "facilityId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "appointments_facilityId_status_idx" ON "appointments"("facilityId", "status");

-- CreateIndex
CREATE INDEX "appointments_facilityId_createdAt_idx" ON "appointments"("facilityId", "createdAt");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "medical_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
