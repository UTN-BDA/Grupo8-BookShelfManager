import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

async function logIndexSizes() {
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

async function logCompositeIndexSize() {
  const result = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      relname AS index_name, 
      pg_size_pretty(pg_relation_size(indexrelid)) AS size
    FROM pg_index
    JOIN pg_class ON pg_class.oid = pg_index.indexrelid
    WHERE indrelid = '"Book"'::regclass
      AND relname IN ('idx_book_author_lower_title', 'idx_book_language_publisher');
  `);

  if (result.length > 0) {
    result.forEach(row => {
      console.log(`- ${row.index_name}: ${row.size}`);
    });
  } else {
    console.log('- idx_book_author_lower_title: (no existe)');
    console.log('- idx_book_language_publisher: (no existe)');
  }
}

async function createCompositeIndex() {
  await logCompositeIndexSize();
  console.log('\nCreando índices compuestos en la tabla "Book"...');
  try {
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_author_lower_title 
      ON "Book" (author, lower(title));
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_language_publisher 
      ON "Book" USING btree (language, publisher);
    `;
    await prisma.$executeRaw`ANALYZE "Book";`;
    console.log('Índices compuestos creados (o ya existentes).');
  } catch (error) {
    console.error('Error al crear los índices compuestos:', error);
  }
  await logCompositeIndexSize();
}

async function searchBooks(author: string, titleContains: string) {
  console.log(`\n=== COMPOSITE INDEX TEST ===`);
  console.log(`Buscando libros del autor "${author}" con título que contiene: "${titleContains}"`);
  const totalStartTime = performance.now();
  try {
    await createCompositeIndex();
    // Forzar uso del índice compuesto y deshabilitar paralelismo
    await prisma.$executeRawUnsafe('SET enable_seqscan = OFF;');
    await prisma.$executeRawUnsafe('SET enable_bitmapscan = OFF;');
    await prisma.$executeRawUnsafe('SET max_parallel_workers_per_gather = 0;');

    // Consulta con índice compuesto usando lower(title)
    const compositeStartTime = performance.now();
    const compositeBooks = await prisma.$queryRawUnsafe<any[]>(
      `
        SELECT book_id, title, author, isbn, pages, publisher, language, "publishedAt", "createdAt", "updatedAt"
        FROM "Book"
        WHERE author = $1
          AND lower(title) LIKE $2
        ORDER BY title ASC
        LIMIT 50;
      `,
      author,
      titleContains.toLowerCase() + '%'
    );
    const compositeEndTime = performance.now();
    const compositeTimeMs = compositeEndTime - compositeStartTime;
    await prisma.$executeRawUnsafe('RESET enable_seqscan;');
    await prisma.$executeRawUnsafe('RESET enable_bitmapscan;');
    await prisma.$executeRawUnsafe('RESET max_parallel_workers_per_gather;');

    // Orden inverso con Prisma
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

    console.log(`\n1. COMPOSITE INDEX QUERY: ${compositeBooks.length} resultados en ${compositeTimeMs.toFixed(2)}ms`);
    console.log(`2. REVERSE ORDER QUERY: ${reverseBooks.length} resultados en ${reverseTimeMs.toFixed(2)}ms`);

    // Solo columna secundaria
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

    console.log(`3. SECOND COLUMN ONLY: ${secondColBooks.length} resultados en ${secondColTimeMs.toFixed(2)}ms`);

    // Plan de ejecución EXPLAIN ANALYZE
    await prisma.$executeRawUnsafe('SET enable_seqscan = OFF;');
    await prisma.$executeRawUnsafe('SET enable_bitmapscan = OFF;');
    await prisma.$executeRawUnsafe('SET max_parallel_workers_per_gather = 0;');
    console.log('\nQuery Plan (COMPOSITE):');
    const queryPlan = await prisma.$queryRawUnsafe<any[]>(
      `
        EXPLAIN ANALYZE
        SELECT book_id, title, author, isbn, pages, publisher, language, "publishedAt", "createdAt", "updatedAt"
        FROM "Book"
        WHERE author = $1
          AND lower(title) LIKE $2
        ORDER BY title ASC
        LIMIT 50;
      `,
      author,
      titleContains.toLowerCase() + '%'
    );
    await prisma.$executeRawUnsafe('RESET enable_seqscan;');
    await prisma.$executeRawUnsafe('RESET enable_bitmapscan;');
    await prisma.$executeRawUnsafe('RESET max_parallel_workers_per_gather;');
    queryPlan.forEach(row => console.log(row['QUERY PLAN']));

    // Mostrar ejemplos
    if (compositeBooks.length > 0) {
      console.log('\nEjemplos de resultados:');
      compositeBooks.slice(0, 5).forEach(book => {
        console.log(`- "${book.title}" (${book.language}) por ${book.author}`);
      });
      if (compositeBooks.length > 5) {
        console.log(`... y ${compositeBooks.length - 5} resultados más.`);
      }
    }

    // Segundo índice (language + publisher)
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

    console.log(`\n4. LANGUAGE+PUBLISHER INDEX: ${langPubBooks.length} libros en ${langPubTimeMs.toFixed(2)}ms`);

    const totalEndTime = performance.now();
    const totalTimeMs = totalEndTime - totalStartTime;
    console.log(`\nTIEMPO TOTAL DE LA BÚSQUEDA: ${totalTimeMs.toFixed(2)}ms`);
    return {
      compositeBooks,
      reverseBooks,
      secondColBooks,
      langPubBooks,
      compositeTimeMs,
      reverseTimeMs,
      secondColTimeMs,
      langPubTimeMs,
      totalTimeMs
    };
  } catch (error) {
    console.error('Error al buscar libros:', error);
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

// === Entrada por consola ===
const author = process.argv[2] || 'Test Author 1';
const titleContains = process.argv[3] || 'Book';

if (!author || !titleContains) {
  console.error('Debes ingresar un autor y un texto a buscar en el título.');
  console.error('Ejemplo: npm run search:composite "Test Author 1" "Book"');
  process.exit(1);
}

searchBooks(author, titleContains)
  .catch(console.error);
