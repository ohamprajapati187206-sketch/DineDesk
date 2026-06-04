-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "name" TEXT,
ALTER COLUMN "menuItemId" DROP NOT NULL;
