-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Waiting', 'Cancelled', 'Reseved');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Waiting';
