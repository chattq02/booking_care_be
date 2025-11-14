-- AlterTable
ALTER TABLE "medical_facilities" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "medical_facilities" ADD CONSTRAINT "medical_facilities_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "medical_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
