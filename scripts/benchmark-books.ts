import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient();

async function performBookJoins(iterations: number) {
  console.log(`Starting performance test for ${iterations} book operations...`);
  
  const startTime = performance.now();
  let successCount = 0;
  let errorCount = 0;
  
  const sampleBook = await prisma.book.create({
    data: {
      title: "Performance Testing Book",
      author: "Test Author",
      isbn: `ISBN-PERF-${Date.now()}`,
      pages: 100,
      publisher: "Test Publisher",
      language: "English",
      publishedAt: new Date()
    }
  });
  
  console.log(`Created sample book with ID: ${sampleBook.id}`);
  
  try {
    for (let i = 0; i < iterations; i++) {
      if (i % 10000 === 0) {
        console.log(`Processed ${i} operations...`);
      }
      
      try {
        await prisma.$queryRaw`
          SELECT b.* 
          FROM "Book" b
          WHERE b.language = 'English'
          AND b.pages > 100
          LIMIT 10
        `;
        
        successCount++;
      } catch (err) {
        errorCount++;
        if (errorCount < 10) {
          console.error(`Error during operation ${i}:`, err);
        } else if (errorCount === 10) {
          console.error('Too many errors, suppressing further error logs...');
        }
      }
    }
  } finally {
    await prisma.book.delete({ where: { id: sampleBook.id } });
  }
  
  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log(`
Performance Test Results:
------------------------
Total operations: ${iterations}
Successful: ${successCount}
Failed: ${errorCount}
Duration: ${duration.toFixed(2)} seconds
Avg operations/sec: ${(successCount / duration).toFixed(2)}
  `);
}

performBookJoins(500000)
  .catch(e => {
    console.error("Script failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Test completed and database connection closed.");
  });