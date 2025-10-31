-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'InActive');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_status" "UserStatus" NOT NULL DEFAULT 'InActive';
