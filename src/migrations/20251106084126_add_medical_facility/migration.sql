-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "facilityId" INTEGER;

-- CreateTable
CREATE TABLE "medical_facilities" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(100),
    "address" VARCHAR(500),
    "phone" VARCHAR(100),
    "email" VARCHAR(255),
    "website" VARCHAR(255),
    "description" VARCHAR(1000),
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacilityDoctors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FacilityDoctors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "medical_facilities_uuid_key" ON "medical_facilities"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "medical_facilities_code_key" ON "medical_facilities"("code");

-- CreateIndex
CREATE INDEX "_FacilityDoctors_B_index" ON "_FacilityDoctors"("B");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "medical_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityDoctors" ADD CONSTRAINT "_FacilityDoctors_A_fkey" FOREIGN KEY ("A") REFERENCES "medical_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityDoctors" ADD CONSTRAINT "_FacilityDoctors_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
