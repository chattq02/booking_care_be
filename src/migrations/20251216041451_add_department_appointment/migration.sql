-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "departmentId" INTEGER;

-- CreateIndex
CREATE INDEX "appointments_departmentId_idx" ON "appointments"("departmentId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
