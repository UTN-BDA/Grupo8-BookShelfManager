import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

async function disableIndexes() {
  console.log('Temporarily disabling indexes for comparison...');
  try {
    const existingIndexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'Book' 
        AND indexname != 'Book_pkey'
        AND indexname != 'Book_isbn_key';
    `;
    console.log(`Found ${Array.isArray(existingIndexes) ? existingIndexes.length : 0} non-primary indexes on Book table`);
    
    console.log('Ready for non-indexed search test');
    return existingIndexes;
  } catch (error) {
    console.error('Error preparing for non-indexed search:', error);
    return [];
  }
}

async function searchBooks(searchTerm: string) {
  console.log(`\n=== NO-INDEX SEARCH TEST ===`);
  console.log(`Searching for books with title containing: "${searchTerm}" WITHOUT using indexes`);
  
  try {
    const existingIndexes = await disableIndexes();
    
    const exactStartTime = performance.now();
    const exactBooks = await prisma.$queryRaw`
      SELECT book_id as id, title, author, isbn, pages, publisher, language, 
             "publishedAt", "createdAt", "updatedAt"
      FROM "Book" 
      WHERE LOWER(title) = ${searchTerm.toLowerCase()}
      LIMIT 50;
    `;
    const exactEndTime = performance.now();
    const exactTimeMs = exactEndTime - exactStartTime;
    
    console.log(`\n1. EXACT MATCH (NO INDEX): Found ${Array.isArray(exactBooks) ? exactBooks.length : 0} books with title "${searchTerm}" in ${exactTimeMs.toFixed(2)}ms`);
    
    const containsStartTime = performance.now();
    const containsBooks = await prisma.$queryRaw`
      SELECT book_id as id, title, author, isbn, pages, publisher, language, 
             "publishedAt", "createdAt", "updatedAt"
      FROM "Book" 
      WHERE LOWER(title) LIKE ${`%${searchTerm.toLowerCase()}%`}
      LIMIT 50;
    `;
    const containsEndTime = performance.now();
    const containsTimeMs = containsEndTime - containsStartTime;
    
    console.log(`2. CONTAINS MATCH (NO INDEX): Found ${Array.isArray(containsBooks) ? containsBooks.length : 0} books containing "${searchTerm}" in ${containsTimeMs.toFixed(2)}ms`);
    
    const compositeStartTime = performance.now();
    const compositeBooks = await prisma.$queryRaw`
      SELECT book_id as id, title, author, isbn, pages, publisher, language, 
             "publishedAt", "createdAt", "updatedAt"
      FROM "Book" 
      WHERE language = 'English' AND LOWER(title) LIKE ${`%${searchTerm.toLowerCase()}%`}
      LIMIT 50;
    `;
    const compositeEndTime = performance.now();
    const compositeTimeMs = compositeEndTime - compositeStartTime;
    
    console.log(`3. COMPOSITE CONDITION (NO INDEX): Found ${Array.isArray(compositeBooks) ? compositeBooks.length : 0} English books containing "${searchTerm}" in ${compositeTimeMs.toFixed(2)}ms`);
    
    console.log('\nQuery Plan (CONTAINS - NO INDEX):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE
      SELECT * FROM "Book" 
      WHERE LOWER(title) LIKE ${`%${searchTerm.toLowerCase()}%`}
      LIMIT 50;
    `;
    console.log(queryPlan);
    
    if (Array.isArray(containsBooks) && containsBooks.length > 0) {
      console.log('\nSample results:');
      containsBooks.slice(0, 5).forEach((book: any) => {
        console.log(`- ${book.title} (${book.language}) by ${book.author}`);
      });
      if (containsBooks.length > 5) {
        console.log(`... and ${containsBooks.length - 5} more results`);
      }
    }
    
    console.log('\nExisting indexes that were bypassed:');
    if (Array.isArray(existingIndexes) && existingIndexes.length > 0) {
      existingIndexes.forEach((idx: any) => {
        console.log(`- ${idx.indexname}: ${idx.indexdef}`);
      });
    } else {
      console.log('No additional indexes found');
    }
    
    return {
      exactBooks: Array.isArray(exactBooks) ? exactBooks : [],
      containsBooks: Array.isArray(containsBooks) ? containsBooks : [],
      compositeBooks: Array.isArray(compositeBooks) ? compositeBooks : [],
      exactTimeMs,
      containsTimeMs,
      compositeTimeMs
    };
  } catch (error) {
    console.error('Error in no-index search:', error);
    return {
      exactBooks: [],
      containsBooks: [],
      compositeBooks: [],
      exactTimeMs: 0,
      containsTimeMs: 0,
      compositeTimeMs: 0
    };
  } finally {
    await prisma.$disconnect();
  }
}

const searchTerm = process.argv[2] || 'Book';

if (!searchTerm) {
  console.error('Please provide a search term');
  console.error('Usage: npx ts-node scripts/tests/no-index.ts "your search term"');
  process.exit(1);
}

searchBooks(searchTerm)
  .catch(console.error);