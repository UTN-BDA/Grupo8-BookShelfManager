import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Book {
    title: string;
    author: string;
    isbn: string;
    pages: number;
    publisher: string;
    language: string;
    publishedAt: Date;
}

async function performBookJoins(iterations: number, batchSize: number = 1000) {
  console.log(`Starting performance test for ${iterations} book operations...`);

  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;
  let errorLogged = 0;

  // Prepara los datos en memoria para cada batch
  function generateBooks(start: number, count: number): Book[] {
  const books: Book[] = [];
  const now = Date.now();
  const minDate = new Date(now - 10 * 365 * 86400000); // 10 años atrás
  for (let i = 0; i < count; i++) {
    const idx = start + i;
    let publishedAt = new Date(now - (idx * 86400000));
    if (publishedAt < minDate) publishedAt = minDate;
    books.push({
      title: `Test Book ${idx + 1}`,
      author: `Test Author ${(idx % 5) + 1}`,
      isbn: `ISBN-TEST-${now}-${idx}`,
      pages: 100 + (idx % 400),
      publisher: `Publisher ${(idx % 10) + 1}`,
      language: idx % 3 === 0 ? "English" : idx % 3 === 1 ? "Spanish" : "French",
      publishedAt
    });
  }
  return books;
}

for (let i = 0; i < iterations; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, iterations - i);
    const books = generateBooks(i, currentBatchSize);

    try {
    await prisma.book.createMany({
        data: books,
        skipDuplicates: true
    });
    successCount += currentBatchSize;
    } catch (err) {
    errorCount += currentBatchSize;
    if (errorLogged < 10) {
        console.error(`Error in batch starting at ${i}:`, err);
        errorLogged++;
    } else if (errorLogged === 10) {
        console.error('Too many errors, suppressing further error logs...');
        errorLogged++;
    }
    }

    if ((i / batchSize) % 10 === 0) {
    console.log(`Processed ${i + currentBatchSize} / ${iterations} operations...`);
    }
}
  
    const duration = (Date.now() - startTime) / 1000;
    console.log(`
        Performance Test Results:
        ------------------------
        Total operations: ${iterations}
        Successful: ${successCount}
        Failed: ${errorCount}
        Duration: ${duration.toFixed(2)} seconds
        Avg operations/sec: ${(successCount / duration).toFixed(2)}`
    );  
}

performBookJoins(5000000, 30000) // 5 millones de libros
  .catch(e => {
    console.error("Script failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Test completed and database connection closed.");
  });