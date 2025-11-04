-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Admin', 'Doctor', 'Patient');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bhyt" VARCHAR(25),
ADD COLUMN     "cccd" VARCHAR(25),
ADD COLUMN     "nation" VARCHAR(255),
ADD COLUMN     "practice_certificate" TEXT,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'Patient',
ALTER COLUMN "description" SET DATA TYPE TEXT;
