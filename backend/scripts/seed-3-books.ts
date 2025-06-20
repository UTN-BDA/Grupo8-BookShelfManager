import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// script para agregar 3 libros a la base de datos y testear
// correr con: npx ts-node scripts/seed-3-books.ts
async function main() {
  await prisma.book.createMany({
    data: [
      {
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        isbn: '978-0307474728',
        pages: 417,
        publisher: 'Editorial Sudamericana',
        language: 'Spanish',
        publishedAt: new Date('1967-05-30'),
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        pages: 328,
        publisher: 'Secker & Warburg',
        language: 'English',
        publishedAt: new Date('1949-06-08'),
      },
      {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        isbn: '978-0156013987',
        pages: 96,
        publisher: 'Gallimard',
        language: 'French',
        publishedAt: new Date('1943-04-06'),
      },
    ],
    skipDuplicates: true,
  });
  console.log('3 libros agregados correctamente');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
