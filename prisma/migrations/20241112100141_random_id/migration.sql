-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Brand_id_seq";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "OrderItem_id_seq";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "Type" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Type_id_seq";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "User_id_seq";
