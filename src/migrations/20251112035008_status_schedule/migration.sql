-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('NORMAL', 'OFF', 'FIXED');

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "status" "ScheduleStatus" NOT NULL DEFAULT 'NORMAL';
