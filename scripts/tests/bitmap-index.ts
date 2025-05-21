import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

// Tipos para los resultados de las consultas de tamaño
interface SizeInfo {
  tabla_size: string;
  indices_size: string;
  idx_language_size?: string;
  idx_lang_title_size?: string;
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
      pg_size_pretty(COALESCE(pg_relation_size('idx_book_language_btree'), 0)) as idx_language_size,
      pg_size_pretty(COALESCE(pg_relation_size('idx_book_lang_title'), 0)) as idx_lang_title_size
  `;
  console.log(`\n${label}`);
  console.log(`- Tamaño de la tabla: ${sizeInfo[0].tabla_size}`);
  console.log(`- Tamaño total de índices: ${sizeInfo[0].indices_size}`);
  console.log(`- Tamaño del índice (language): ${sizeInfo[0].idx_language_size}`);
  console.log(`- Tamaño del índice (language + lower(title)): ${sizeInfo[0].idx_lang_title_size}`);
}

async function logBitmapIndexSize() {
  const result = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      relname AS index_name, 
      pg_size_pretty(pg_relation_size(indexrelid)) AS size
    FROM pg_index
    JOIN pg_class ON pg_class.oid = pg_index.indexrelid
    WHERE indrelid = '"Book"'::regclass
      AND relname IN ('idx_book_language_btree', 'idx_book_lang_title');
  `);

  if (result.length > 0) {
    result.forEach(row => {
      console.log(`- ${row.index_name}: ${row.size}`);
    });
  } else {
    console.log('- idx_book_language_btree: (no existe)');
    console.log('- idx_book_lang_title: (no existe)');
  }
}

async function createBitmapFriendlyIndexes() {
  await logBitmapIndexSize();
  console.log('Creando índices bitmap-friendly...');
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
    console.log('Índices bitmap-friendly creados o ya existían');
  } catch (error) {
    console.error('Error al crear los índices bitmap-friendly:', error);
  }
  await logBitmapIndexSize();
}

async function searchBooks(searchTerm: string) {
  console.log(`\n=== BITMAP INDEX TEST ===`);
  console.log(`Buscando libros con título que contenga: "${searchTerm}"`);
  const totalStartTime = performance.now();
  try {
    await createBitmapFriendlyIndexes();
    // Forzar uso de bitmap scan
    await prisma.$executeRaw`SET enable_seqscan = off;`;
    await prisma.$executeRaw`SET enable_indexscan = off;`;
    await prisma.$executeRaw`SET enable_bitmapscan = on;`;

    
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
    
    console.log(`\n1. EXACT MATCH: Encontrados ${exactBooks.length} libros con título "${searchTerm}" en ${exactTimeMs.toFixed(2)}ms`);
    
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
    
    console.log(`2. CONTAINS MATCH: Encontrados ${containsBooks.length} libros que contienen "${searchTerm}" en ${containsTimeMs.toFixed(2)}ms`);
    
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
    
    console.log(`3. BITMAP AND: Encontrados ${bitmapBooks.length} libros en inglés que contienen "${searchTerm}" en ${bitmapTimeMs.toFixed(2)}ms`);
    
    console.log('\nQuery Plan (AND condition):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT * FROM "Book" 
      WHERE language = 'English' AND LOWER(title) LIKE ${`%${searchTerm.toLowerCase()}%`}
      LIMIT 50;
    `;
    console.log(queryPlan);
    
    if (bitmapBooks.length > 0) {
      console.log('\nEjemplos de resultados:');
      bitmapBooks.slice(0, 5).forEach(book => {
        console.log(`- ${book.title} (${book.language}) by ${book.author}`);
      });
      if (bitmapBooks.length > 5) {
        console.log(`... y ${bitmapBooks.length - 5} resultados más`);
      }
    }
    const totalEndTime = performance.now();
    const totalTimeMs = totalEndTime - totalStartTime;
    console.log(`\nTIEMPO TOTAL DE LA BÚSQUEDA: ${totalTimeMs.toFixed(2)}ms`);
    return { exactBooks, containsBooks, bitmapBooks, exactTimeMs, containsTimeMs, bitmapTimeMs, totalTimeMs };
  } catch (error) {
    console.error('Error en búsqueda de libros:', error);
    return { exactBooks: [], containsBooks: [], bitmapBooks: [], exactTimeMs: 0, containsTimeMs: 0, bitmapTimeMs: 0 };
  } finally {
    await prisma.$executeRaw`RESET enable_seqscan;`;
    await prisma.$executeRaw`RESET enable_indexscan;`;
    await prisma.$executeRaw`RESET enable_bitmapscan;`;

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
