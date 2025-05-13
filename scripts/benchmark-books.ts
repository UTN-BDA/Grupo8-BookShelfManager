import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient();

async function performBookJoins(iterations: number) {
  console.log(`Starting performance test for ${iterations} book operations...`);
  
  const startTime = performance.now();
  let successCount = 0;
  let errorCount = 0;
  
  // Create initial sample book
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
        // Create a book with dynamic data based on iteration
        await prisma.book.create({
          data: {
            title: `Test Book ${i+1}`,
            author: `Test Author ${i % 5 + 1}`,
            isbn: `ISBN-TEST-${Date.now()}-${i}`,
            pages: 100 + (i % 400),
            publisher: `Publisher ${i % 10 + 1}`,
            language: i % 3 === 0 ? "English" : i % 3 === 1 ? "Spanish" : "French",
            publishedAt: new Date(Date.now() - (i * 86400000))
          }
        });
        
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

performBookJoins(500000) // Crear 500mil libros
  .catch(e => {
    console.error("Script failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Test completed and database connection closed.");
  });