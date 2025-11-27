-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "paymentAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "slots" SET DEFAULT '[]';
