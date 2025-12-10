/*
  Warnings:

  - You are about to drop the column `usageInstruction` on the `prescription_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prescription_items" DROP COLUMN "usageInstruction",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "frequency" TEXT,
ADD COLUMN     "instruction" TEXT,
ADD COLUMN     "mealTime" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "startDate" TEXT,
ADD COLUMN     "unit" TEXT;
