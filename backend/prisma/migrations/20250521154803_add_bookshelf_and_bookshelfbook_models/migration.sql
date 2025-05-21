-- CreateTable
CREATE TABLE "Bookshelf" (
    "bookshelf_id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookshelf_pkey" PRIMARY KEY ("bookshelf_id")
);

-- CreateTable
CREATE TABLE "BookshelfBook" (
    "bookshelf_book_id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "bookshelfId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookshelfBook_pkey" PRIMARY KEY ("bookshelf_book_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookshelfBook_bookshelfId_bookId_userId_key" ON "BookshelfBook"("bookshelfId", "bookId", "userId");

-- AddForeignKey
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("bookshelf_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
