import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

async function createCompositeIndex() {
  console.log('Creating composite indexes on book columns...');
  try {
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_author_title 
      ON "Book" USING btree (author, lower(title));
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_language_publisher 
      ON "Book" USING btree (language, publisher);
    `;
    
    await prisma.$executeRaw`ANALYZE "Book";`;
    console.log('Composite indexes created or already exist');
  } catch (error) {
    console.error('Error creating composite indexes:', error);
  }
}

async function searchBooks(author: string, titleContains: string) {
  console.log(`\n=== COMPOSITE INDEX TEST ===`);
  console.log(`Searching for books by author "${author}" with title containing: "${titleContains}"`);
  
  try {
    await createCompositeIndex();
    const compositeStartTime = performance.now();
    const compositeBooks = await prisma.book.findMany({
      where: {
        AND: [
          { author: author },
          { title: { contains: titleContains, mode: 'insensitive' } }
        ]
      },
      orderBy: {
        title: 'asc'
      },
      take: 50
    });
    const compositeEndTime = performance.now();
    const compositeTimeMs = compositeEndTime - compositeStartTime;
    
    console.log(`\n1. COMPOSITE INDEX QUERY: Found ${compositeBooks.length} books by "${author}" containing "${titleContains}" in ${compositeTimeMs.toFixed(2)}ms`);
    
    const reverseStartTime = performance.now();
    const reverseBooks = await prisma.book.findMany({
      where: {
        AND: [
          { title: { contains: titleContains, mode: 'insensitive' } },
          { author: author }
        ]
      },
      take: 50
    });
    const reverseEndTime = performance.now();
    const reverseTimeMs = reverseEndTime - reverseStartTime;
    
    console.log(`2. REVERSE ORDER QUERY: Found ${reverseBooks.length} books containing "${titleContains}" by "${author}" in ${reverseTimeMs.toFixed(2)}ms`);
    
    const secondColStartTime = performance.now();
    const secondColBooks = await prisma.book.findMany({
      where: {
        title: {
          contains: titleContains,
          mode: 'insensitive' 
        }
      },
      take: 50
    });
    const secondColEndTime = performance.now();
    const secondColTimeMs = secondColEndTime - secondColStartTime;
    
    console.log(`3. SECOND COLUMN ONLY: Found ${secondColBooks.length} books containing "${titleContains}" in ${secondColTimeMs.toFixed(2)}ms`);
    
    console.log('\nQuery Plan (COMPOSITE):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT * FROM "Book" 
      WHERE author = ${author} AND LOWER(title) LIKE ${`%${titleContains.toLowerCase()}%`}
      ORDER BY title ASC
      LIMIT 50;
    `;
    console.log(queryPlan);
    
    if (compositeBooks.length > 0) {
      console.log('\nSample results:');
      compositeBooks.slice(0, 5).forEach(book => {
        console.log(`- ${book.title} (${book.language}) by ${book.author}`);
      });
      if (compositeBooks.length > 5) {
        console.log(`... and ${compositeBooks.length - 5} more results`);
      }
    }
    
    const langPubStartTime = performance.now();
    const langPubBooks = await prisma.book.findMany({
      where: {
        AND: [
          { language: 'English' },
          { publisher: 'Publisher 1' }
        ]
      },
      take: 50
    });
    const langPubEndTime = performance.now();
    const langPubTimeMs = langPubEndTime - langPubStartTime;
    
    console.log(`\n4. LANGUAGE+PUBLISHER INDEX: Found ${langPubBooks.length} English books from "Publisher 1" in ${langPubTimeMs.toFixed(2)}ms`);
    
    return { 
      compositeBooks, 
      reverseBooks,
      secondColBooks,
      langPubBooks,
      compositeTimeMs,
      reverseTimeMs,
      secondColTimeMs,
      langPubTimeMs
    };
  } catch (error) {
    console.error('Error searching books:', error);
    return { 
      compositeBooks: [], 
      reverseBooks: [],
      secondColBooks: [],
      langPubBooks: [],
      compositeTimeMs: 0,
      reverseTimeMs: 0,
      secondColTimeMs: 0,
      langPubTimeMs: 0
    };
  } finally {
    await prisma.$disconnect();
  }
}

const author = process.argv[2] || 'Test Author 1';
const titleContains = process.argv[3] || 'Book';

if (!author || !titleContains) {
  console.error('Please provide an author and title search term');
  console.error('Usage: npm run search:composite "Test Author 1" "Book"');
  process.exit(1);
}

searchBooks(author, titleContains)
  .catch(console.error);