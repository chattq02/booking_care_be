-- AlterTable
ALTER TABLE "users" ADD COLUMN     "academicTitleId" INTEGER;

-- CreateTable
CREATE TABLE "academic_titles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_titles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_titles_name_key" ON "academic_titles"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_academicTitleId_fkey" FOREIGN KEY ("academicTitleId") REFERENCES "academic_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
