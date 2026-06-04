-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "branchId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "DiningTable" ALTER COLUMN "branchId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InventoryItem" ALTER COLUMN "branchId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "branchId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "branchId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "branchId" DROP DEFAULT;
