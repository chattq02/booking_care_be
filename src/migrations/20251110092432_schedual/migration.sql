/*
  Warnings:

  - You are about to drop the column `endTime` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `slots` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeOffType" AS ENUM ('FACILITY', 'DEPARTMENT', 'DOCTOR');

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "endTime",
DROP COLUMN "isAvailable",
DROP COLUMN "startTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "departmentId" INTEGER,
ADD COLUMN     "facilityId" INTEGER,
ADD COLUMN     "slots" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "doctorId" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL;

-- CreateTable
CREATE TABLE "time_offs" (
    "id" SERIAL NOT NULL,
    "entityId" INTEGER NOT NULL,
    "type" "TimeOffType" NOT NULL,
    "date" TIMESTAMP(3),
    "slots" JSONB NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_offs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "time_offs_entityId_type_date_idx" ON "time_offs"("entityId", "type", "date");

-- CreateIndex
CREATE INDEX "schedules_doctorId_date_idx" ON "schedules"("doctorId", "date");

-- CreateIndex
CREATE INDEX "schedules_facilityId_departmentId_idx" ON "schedules"("facilityId", "departmentId");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "medical_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
