import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

/**
 * Bitmap Index Test
 * Bitmap indexes are efficient for low-cardinality columns and complex conditions
 */
async function createBitmapFriendlyIndexes() {
  console.log('Creating bitmap-friendly indexes...');
  try {
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_language_btree 
      ON "Book" USING btree (language);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_lang_title 
      ON "Book" USING btree (language, lower(title));
    `;
    
    await prisma.$executeRaw`ANALYZE "Book";`;
    console.log('Bitmap-friendly indexes created or already exists');
  } catch (error) {
    console.error('Error creating bitmap-friendly indexes:', error);
  }
}

async function searchBooks(searchTerm: string) {
  console.log(`\n=== BITMAP INDEX TEST ===`);
  console.log(`Searching for books with title containing: "${searchTerm}"`);
  
  try {
    await createBitmapFriendlyIndexes();
    
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
    
    const bitmapStartTime = performance.now();
    const bitmapBooks = await prisma.book.findMany({
      where: {
        AND: [
          { language: 'English' },
          { title: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      take: 50
    });
    const bitmapEndTime = performance.now();
    const bitmapTimeMs = bitmapEndTime - bitmapStartTime;
    
    console.log(`3. BITMAP AND: Found ${bitmapBooks.length} English books containing "${searchTerm}" in ${bitmapTimeMs.toFixed(2)}ms`);
    
    console.log('\nQuery Plan (AND condition):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT * FROM "Book" 
      WHERE language = 'English' AND LOWER(title) LIKE ${`%${searchTerm.toLowerCase()}%`}
      LIMIT 50;
    `;
    console.log(queryPlan);
    
    if (bitmapBooks.length > 0) {
      console.log('\nSample results:');
      bitmapBooks.slice(0, 5).forEach(book => {
        console.log(`- ${book.title} (${book.language}) by ${book.author}`);
      });
      if (bitmapBooks.length > 5) {
        console.log(`... and ${bitmapBooks.length - 5} more results`);
      }
    }
    
    return { exactBooks, containsBooks, bitmapBooks, exactTimeMs, containsTimeMs, bitmapTimeMs };
  } catch (error) {
    console.error('Error searching books:', error);
    return { exactBooks: [], containsBooks: [], bitmapBooks: [], exactTimeMs: 0, containsTimeMs: 0, bitmapTimeMs: 0 };
  } finally {
    await prisma.$disconnect();
  }
}

const searchTerm = process.argv[2] || 'Book';

if (!searchTerm) {
  console.error('Please provide a search term');
  console.error('Usage: npm run search:bitmap "your search term"');
  process.exit(1);
}

searchBooks(searchTerm)
  .catch(console.error);