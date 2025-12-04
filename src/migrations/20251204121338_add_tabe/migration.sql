/*
  Warnings:

  - Added the required column `medicineName` to the `prescription_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prescription_items" ADD COLUMN     "medicineName" TEXT NOT NULL;
