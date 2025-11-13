-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "facilityId" INTEGER;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "medical_facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
