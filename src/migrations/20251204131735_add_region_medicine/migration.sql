/*
  Warnings:

  - Added the required column `facilityId` to the `medicines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicines" ADD COLUMN     "facilityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "medical_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
