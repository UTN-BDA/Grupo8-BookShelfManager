import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

async function createFullTextIndex() {
  console.log('Creating full-text search index on book titles...');
  try {
    // Agrega la columna solo si no existe
    await prisma.$executeRaw`
      ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS title_tsv tsvector;
    `;

    // Solo actualiza los registros que no tengan tsvector calculado
    await prisma.$executeRaw`
      UPDATE "Book"
      SET title_tsv = to_tsvector('english', title)
      WHERE title_tsv IS NULL;
    `;

    // Crea el índice solo si no existe
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_title_fulltext 
      ON "Book" USING GIN (title_tsv);
    `;

    // Trigger y función para mantener actualizado el tsvector
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
  const totalStartTime = performance.now();
  try {
    // Medición antes de crear el índice (solo full-text)
    await logFullTextIndexSize();

    await createFullTextIndex();

    // Medición después de crear el índice (solo full-text)
    await logFullTextIndexSize();

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
    
    // Deshabilitar seqscan para forzar uso del índice full-text
    await prisma.$executeRawUnsafe('SET enable_seqscan = OFF;');

    const fulltextStartTime = performance.now();
    const fulltextBooks = await prisma.$queryRaw`
      SELECT book_id as id, title, author, isbn, pages, publisher, language, 
             "publishedAt", "createdAt", "updatedAt",
             title_tsv::text as title_tsv_text
      FROM "Book" 
      WHERE title_tsv @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(title_tsv, plainto_tsquery('english', ${searchTerm})) DESC
      LIMIT 50;
    `;
    const fulltextEndTime = performance.now();
    const fulltextTimeMs = fulltextEndTime - fulltextStartTime;

    // Mostrar el plan de ejecución con seqscan deshabilitado
    console.log('\nQuery Plan (FULL-TEXT):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT book_id as id, title, author
      FROM "Book" 
      WHERE title_tsv @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(title_tsv, plainto_tsquery('english', ${searchTerm})) DESC
      LIMIT 50;
    `;
    console.log(queryPlan);

    // Restaurar seqscan
    await prisma.$executeRawUnsafe('RESET enable_seqscan;');
    
    if (Array.isArray(fulltextBooks) && fulltextBooks.length > 0) {
      console.log('\nSample results:');
      fulltextBooks.slice(0, 5).forEach((book: any) => {
        console.log(`- ${book.title} (${book.language}) by ${book.author}`);
      });
      if (fulltextBooks.length > 5) {
        console.log(`... and ${fulltextBooks.length - 5} more results`);
      }
    }
    const totalEndTime = performance.now();
    const totalTimeMs = totalEndTime - totalStartTime;
    console.log(`\nTIEMPO TOTAL DE LA BÚSQUEDA: ${totalTimeMs.toFixed(2)}ms`);
    return { 
      exactBooks, 
      containsBooks, 
      fulltextBooks: Array.isArray(fulltextBooks) ? fulltextBooks : [], 
      exactTimeMs, 
      containsTimeMs, 
      fulltextTimeMs, 
      totalTimeMs
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

async function logIndexSizesFullText() {
  console.log('\n=== Tamaño de los índices en la tabla "Book" ===');

  const result = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      relname AS index_name, 
      pg_size_pretty(pg_relation_size(indexrelid)) AS size
    FROM pg_index
    JOIN pg_class ON pg_class.oid = pg_index.indexrelid
    WHERE indrelid = '"Book"'::regclass;
  `);

  result.forEach(row => {
    console.log(`- ${row.index_name}: ${row.size}`);
  });

  const totalSize = await prisma.$queryRawUnsafe<any[]>(`
    SELECT pg_size_pretty(SUM(pg_relation_size(indexrelid))) AS total_index_size
    FROM pg_index
    WHERE indrelid = '"Book"'::regclass;
  `);

  console.log(`- Tamaño total de todos los índices: ${totalSize[0].total_index_size}`);
}

async function logFullTextIndexSize() {
  const result = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      relname AS index_name, 
      pg_size_pretty(pg_relation_size(indexrelid)) AS size
    FROM pg_index
    JOIN pg_class ON pg_class.oid = pg_index.indexrelid
    WHERE indrelid = '"Book"'::regclass
      AND relname = 'idx_book_title_fulltext';
  `);

  if (result.length > 0) {
    console.log(`- idx_book_title_fulltext: ${result[0].size}`);
  } else {
    console.log('- idx_book_title_fulltext: (no existe)');
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