/*
  Warnings:

  - You are about to drop the column `medicineName` on the `prescription_items` table. All the data in the column will be lost.
  - Added the required column `medicineId` to the `prescription_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prescription_items" DROP COLUMN "medicineName",
ADD COLUMN     "medicineId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "medicines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),
    "unit" VARCHAR(100),
    "price" DOUBLE PRECISION,
    "stock" INTEGER,
    "usage" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
