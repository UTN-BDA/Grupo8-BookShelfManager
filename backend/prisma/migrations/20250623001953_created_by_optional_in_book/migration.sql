-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "createdBy" TEXT;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
