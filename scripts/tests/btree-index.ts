import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

// Tipos para los resultados de las consultas de tamaño
interface SizeInfo {
  tabla_size: string;
  indices_size: string;
  btree_index_size?: string;
}

async function printStorageInfo(label: string) {
  const sizeInfo = await prisma.$queryRaw<SizeInfo[]>`
    SELECT 
      pg_size_pretty(pg_relation_size('"Book"')) as tabla_size,
      pg_size_pretty(COALESCE(
        (SELECT SUM(pg_relation_size(indexrelid)) 
         FROM pg_index i
         JOIN pg_class c ON i.indexrelid = c.oid
         WHERE i.indrelid = '"Book"'::regclass
        ), 0)) as indices_size,
      pg_size_pretty(
        COALESCE(pg_relation_size('idx_book_title_btree'), 0)
      ) as btree_index_size
  `;
  console.log(`\n${label}`);
  console.log(`- Tamaño de la tabla: ${sizeInfo[0].tabla_size}`);
  console.log(`- Tamaño total de índices: ${sizeInfo[0].indices_size}`);
  console.log(`- Tamaño del índice B-Tree: ${sizeInfo[0].btree_index_size}`);
}

async function logBTreeIndexSize() {
  const result = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      relname AS index_name, 
      pg_size_pretty(pg_relation_size(indexrelid)) AS size
    FROM pg_index
    JOIN pg_class ON pg_class.oid = pg_index.indexrelid
    WHERE indrelid = '"Book"'::regclass
      AND relname = 'idx_book_title_btree';
  `);

  if (result.length > 0) {
    console.log(`- idx_book_title_btree: ${result[0].size}`);
  } else {
    console.log('- idx_book_title_btree: (no existe)');
  }
}

async function createBTreeIndex() {
  await logBTreeIndexSize();
  console.log('Creando índice B-Tree en títulos de libros...');
  try {
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_title_btree 
      ON "Book" USING btree (lower(title));
    `;
    await prisma.$executeRaw`ANALYZE "Book";`;
    console.log('Índice B-Tree creado o ya existente');
  } catch (error) {
    console.error('Error al crear el índice B-Tree:', error);
  }
  await logBTreeIndexSize();
}

async function searchBooks(searchTerm: string) {
  console.log(`\n=== B-TREE INDEX TEST ===`);
  console.log(`Buscando libros cuyo título contiene: "${searchTerm}"`);
  const totalStartTime = performance.now();
  try {
    await createBTreeIndex();
    // Forzar uso del índice B-Tree
    await prisma.$executeRawUnsafe('SET enable_seqscan = OFF;');
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
    await prisma.$executeRawUnsafe('RESET enable_seqscan;');
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

    // Forzar uso del índice B-Tree en el plan de ejecución
    await prisma.$executeRawUnsafe('SET enable_seqscan = OFF;');
    await prisma.$executeRawUnsafe('SET enable_bitmapscan = OFF;');
    console.log('\nQuery Plan (PREFIX):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT * FROM "Book"
      WHERE LOWER(title) LIKE ${searchTerm.toLowerCase() + '%'}
      LIMIT 50;
    `;
    await prisma.$executeRawUnsafe('RESET enable_seqscan;');
    await prisma.$executeRawUnsafe('RESET enable_bitmapscan;');
    console.log(queryPlan);

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
  console.error('Usage: npm run search:b-tree "your search term"');
  process.exit(1);
}

searchBooks(searchTerm)
  .catch(console.error);