/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `medical_facilities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medical_facilities_name_key" ON "medical_facilities"("name");
