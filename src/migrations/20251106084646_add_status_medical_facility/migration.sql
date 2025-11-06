/*
  Warnings:

  - The `isActive` column on the `medical_facilities` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MedicalFacilityStatus" AS ENUM ('Active', 'InActive');

-- AlterTable
ALTER TABLE "medical_facilities" DROP COLUMN "isActive",
ADD COLUMN     "isActive" "MedicalFacilityStatus" NOT NULL DEFAULT 'Active';
