import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

async function createFullTextIndex() {
  console.log('Creating full-text search index on book titles...');
  try {
    await prisma.$executeRaw`
      ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS title_tsv tsvector;
    `;
    
    await prisma.$executeRaw`
      UPDATE "Book" SET title_tsv = to_tsvector('english', title);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_title_fulltext 
      ON "Book" USING GIN (title_tsv);
    `;
    
    await prisma.$executeRaw`
      CREATE OR REPLACE FUNCTION book_title_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.title_tsv := to_tsvector('english', NEW.title);
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `;
    
    const triggerExists = await prisma.$queryRaw`
      SELECT 1 FROM pg_trigger WHERE tgname = 'book_title_update_trigger';
    `;
    
    if (!Array.isArray(triggerExists) || triggerExists.length === 0) {
      await prisma.$executeRaw`
        CREATE TRIGGER book_title_update_trigger 
        BEFORE INSERT OR UPDATE ON "Book"
        FOR EACH ROW EXECUTE FUNCTION book_title_trigger();
      `;
    }
    
    await prisma.$executeRaw`ANALYZE "Book";`;
    console.log('Full-text search index created or already exists');
  } catch (error) {
    console.error('Error creating full-text search index:', error);
  }
}

async function searchBooks(searchTerm: string) {
  console.log(`\n=== FULL-TEXT INDEX TEST ===`);
  console.log(`Searching for books with title containing: "${searchTerm}"`);
  
  try {
    await createFullTextIndex();
    
    const exactStartTime = performance.now();
    const exactBooks = await prisma.book.findMany({
      where: {
        title: {
          equals: searchTerm,
          mode: 'insensitive' 
        }
      },
      take: 50
    });
    const exactEndTime = performance.now();
    const exactTimeMs = exactEndTime - exactStartTime;
    
    console.log(`\n1. EXACT MATCH: Found ${exactBooks.length} books with title "${searchTerm}" in ${exactTimeMs.toFixed(2)}ms`);
    
    const containsStartTime = performance.now();
    const containsBooks = await prisma.book.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      take: 50
    });
    const containsEndTime = performance.now();
    const containsTimeMs = containsEndTime - containsStartTime;
    
    console.log(`2. CONTAINS MATCH: Found ${containsBooks.length} books containing "${searchTerm}" in ${containsTimeMs.toFixed(2)}ms`);
    
    const fulltextStartTime = performance.now();
    const fulltextBooks = await prisma.$queryRaw`
      SELECT * FROM "Book" 
      WHERE title_tsv @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(title_tsv, plainto_tsquery('english', ${searchTerm})) DESC
      LIMIT 50;
    `;
    const fulltextEndTime = performance.now();
    const fulltextTimeMs = fulltextEndTime - fulltextStartTime;
    
    console.log(`3. FULL-TEXT SEARCH: Found ${Array.isArray(fulltextBooks) ? fulltextBooks.length : 0} books matching "${searchTerm}" in ${fulltextTimeMs.toFixed(2)}ms`);
    
    console.log('\nQuery Plan (FULL-TEXT):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT * FROM "Book" 
      WHERE title_tsv @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(title_tsv, plainto_tsquery('english', ${searchTerm})) DESC
      LIMIT 50;
    `;
    console.log(queryPlan);
    
    if (Array.isArray(fulltextBooks) && fulltextBooks.length > 0) {
      console.log('\nSample results:');
      fulltextBooks.slice(0, 5).forEach((book: any) => {
        console.log(`- ${book.title} (${book.language}) by ${book.author}`);
      });
      if (fulltextBooks.length > 5) {
        console.log(`... and ${fulltextBooks.length - 5} more results`);
      }
    }
    
    return { 
      exactBooks, 
      containsBooks, 
      fulltextBooks: Array.isArray(fulltextBooks) ? fulltextBooks : [], 
      exactTimeMs, 
      containsTimeMs, 
      fulltextTimeMs 
    };
  } catch (error) {
    console.error('Error searching books:', error);
    return { 
      exactBooks: [], 
      containsBooks: [], 
      fulltextBooks: [], 
      exactTimeMs: 0, 
      containsTimeMs: 0, 
      fulltextTimeMs: 0 
    };
  } finally {
    await prisma.$disconnect();
  }
}

const searchTerm = process.argv[2] || 'Book';

if (!searchTerm) {
  console.error('Please provide a search term');
  console.error('Usage: npm run search:fulltext "your search term"');
  process.exit(1);
}

searchBooks(searchTerm)
  .catch(console.error);