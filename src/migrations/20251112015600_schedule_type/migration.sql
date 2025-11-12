/*
  Warnings:

  - Added the required column `type` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('DOCTOR', 'DEPARTMENT', 'FACILITY');

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "type" "ScheduleType" NOT NULL;
