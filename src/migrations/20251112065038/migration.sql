/*
  Warnings:

  - A unique constraint covering the columns `[name,facilityId]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."departments_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_facilityId_key" ON "departments"("name", "facilityId");
