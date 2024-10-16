/*
  Warnings:

  - You are about to drop the column `reference` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_reference_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "reference";
