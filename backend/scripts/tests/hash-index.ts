import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

async function createHashIndex() {
  console.log('Creating hash index on book titles...');
  try {
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_title_hash 
      ON "Book" USING hash (lower(title));
    `;
    await prisma.$executeRaw`ANALYZE "Book";`;
    console.log('Hash index created or already exists');
  } catch (error) {
    console.error('Error creating hash index:', error);
  }
}

async function logHashIndexSize() {
  const result = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      relname AS index_name, 
      pg_size_pretty(pg_relation_size(indexrelid)) AS size
    FROM pg_index
    JOIN pg_class ON pg_class.oid = pg_index.indexrelid
    WHERE indrelid = '"Book"'::regclass
      AND relname = 'idx_book_title_hash';
  `);

  if (result.length > 0) {
    console.log(`- idx_book_title_hash: ${result[0].size}`);
  } else {
    console.log('- idx_book_title_hash: (no existe)');
  }
}

async function searchBooks(searchTerm: string) {
  console.log(`\n=== HASH INDEX TEST ===`);
  console.log(`Searching for books with title containing: "${searchTerm}"`);
  const totalStartTime = performance.now();
  try {
    // Medición antes de crear el índice (solo hash)
    await logHashIndexSize();

    await createHashIndex();

    // Medición después de crear el índice (solo hash)
    await logHashIndexSize();

    // Forzar uso del hash index
    await prisma.$executeRawUnsafe('SET enable_seqscan = OFF;');
    await prisma.$executeRawUnsafe('SET enable_indexscan = OFF;');
    await prisma.$executeRawUnsafe('SET enable_bitmapscan = OFF;');

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

    // Restaurar los scans
    await prisma.$executeRawUnsafe('RESET enable_seqscan;');
    await prisma.$executeRawUnsafe('RESET enable_indexscan;');
    await prisma.$executeRawUnsafe('RESET enable_bitmapscan;');

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

    console.log('\nQuery Plan (EXACT MATCH):');
    // Forzar uso del hash index en el plan de ejecución
    await prisma.$executeRawUnsafe('SET enable_seqscan = OFF;');
    await prisma.$executeRawUnsafe('SET enable_indexscan = OFF;');
    await prisma.$executeRawUnsafe('SET enable_bitmapscan = OFF;');
    const queryPlanExact = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT * FROM "Book" 
      WHERE LOWER(title) = ${searchTerm.toLowerCase()}
      LIMIT 50;
    `;
    await prisma.$executeRawUnsafe('RESET enable_seqscan;');
    await prisma.$executeRawUnsafe('RESET enable_indexscan;');
    await prisma.$executeRawUnsafe('RESET enable_bitmapscan;');
    console.log(queryPlanExact);

    if (containsBooks.length > 0) {
      console.log('\nSample results:');
      containsBooks.slice(0, 5).forEach(book => {
        console.log(`- ${book.title} (${book.language}) by ${book.author}`);
      });
      if (containsBooks.length > 5) {
        console.log(`... and ${containsBooks.length - 5} more results`);
      }
    }
    const totalEndTime = performance.now();
    const totalTimeMs = totalEndTime - totalStartTime;
    console.log(`\nTIEMPO TOTAL DE LA BÚSQUEDA: ${totalTimeMs.toFixed(2)}ms`);
    return { exactBooks, containsBooks, exactTimeMs, containsTimeMs, totalTimeMs };
  } catch (error) {
    console.error('Error searching books:', error);
    return { exactBooks: [], containsBooks: [], exactTimeMs: 0, containsTimeMs: 0 };
  } finally {
    await prisma.$disconnect();
  }
}

const searchTerm = process.argv[2] || 'Book';

if (!searchTerm) {
  console.error('Please provide a search term');
  console.error('Usage: npm run search:hash "your search term"');
  process.exit(1);
}

searchBooks(searchTerm)
  .catch(console.error);