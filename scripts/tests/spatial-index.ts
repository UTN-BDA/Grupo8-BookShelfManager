import { prisma } from '../../src/config';
import { performance } from 'perf_hooks';

async function setupSpatialExtension() {
  console.log('Setting up PostGIS extension and spatial columns...');
  try {
    await prisma.$executeRaw`
      CREATE EXTENSION IF NOT EXISTS postgis;
    `;
    
    const columnExists = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Book' AND column_name = 'location';
    `;
    
    if (!Array.isArray(columnExists) || columnExists.length === 0) {
      await prisma.$executeRaw`
        ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS location GEOMETRY(Point, 4326);
      `;
      
      await prisma.$executeRaw`
        UPDATE "Book"
        SET location = ST_SetSRID(
          ST_MakePoint(
            -74.0 + (random() * 8), -- Longitude around New York ±4 degrees
            40.7 + (random() * 6)    -- Latitude around New York ±3 degrees
          ),
          4326
        )
        WHERE location IS NULL;
      `;
      
      console.log('Added spatial data to books');
    }
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_book_location_rtree
      ON "Book" USING GIST (location);
    `;
    
    await prisma.$executeRaw`ANALYZE "Book";`;
    console.log('Spatial index created or already exists');
  } catch (error) {
    console.error('Error setting up spatial index:', error);
    console.error('Make sure PostGIS extension is available in your database');
  }
}

async function searchBooks(searchCoords: [number, number], radiusKm: number) {
  const [longitude, latitude] = searchCoords;
  console.log(`\n=== SPATIAL INDEX TEST (R-Tree via GiST) ===`);
  console.log(`Searching for books within ${radiusKm}km of coordinates [${longitude}, ${latitude}]`);
  
  try {
    await setupSpatialExtension();
    
    const basicStartTime = performance.now();
    const basicBooks = await prisma.book.findMany({
      where: {
        language: 'English'
      },
      take: 50
    });
    const basicEndTime = performance.now();
    const basicTimeMs = basicEndTime - basicStartTime;
    
    console.log(`\n1. BASIC QUERY: Found ${basicBooks.length} English books in ${basicTimeMs.toFixed(2)}ms`);
    
    const spatialStartTime = performance.now();
    const spatialBooks = await prisma.$queryRaw`
      SELECT id, title, author, language, 
             ST_X(location) as longitude, 
             ST_Y(location) as latitude,
             ST_Distance(
               location, 
               ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
             ) / 1000 as distance_km
      FROM "Book" 
      WHERE ST_DWithin(
        location::geography, 
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, 
        ${radiusKm * 1000}  -- convert km to meters
      )
      ORDER BY distance_km
      LIMIT 50;
    `;
    const spatialEndTime = performance.now();
    const spatialTimeMs = spatialEndTime - spatialStartTime;
    
    console.log(`2. SPATIAL QUERY: Found ${Array.isArray(spatialBooks) ? spatialBooks.length : 0} books within ${radiusKm}km radius in ${spatialTimeMs.toFixed(2)}ms`);
    
    console.log('\nQuery Plan (SPATIAL):');
    const queryPlan = await prisma.$queryRaw`
      EXPLAIN ANALYZE 
      SELECT id, title, author
      FROM "Book" 
      WHERE ST_DWithin(
        location::geography, 
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, 
        ${radiusKm * 1000}
      )
      LIMIT 50;
    `;
    console.log(queryPlan);
    
    if (Array.isArray(spatialBooks) && spatialBooks.length > 0) {
      console.log('\nSample results:');
      spatialBooks.slice(0, 5).forEach((book: any) => {
        console.log(`- "${book.title}" by ${book.author} (${book.distance_km.toFixed(2)}km away)`);
      });
      if (spatialBooks.length > 5) {
        console.log(`... and ${spatialBooks.length - 5} more results`);
      }
    }
    
    return {
      basicBooks,
      spatialBooks: Array.isArray(spatialBooks) ? spatialBooks : [],
      basicTimeMs,
      spatialTimeMs
    };
  } catch (error) {
    console.error('Error in spatial search:', error);
    return { 
      basicBooks: [], 
      spatialBooks: [], 
      basicTimeMs: 0, 
      spatialTimeMs: 0 
    };
  } finally {
    await prisma.$disconnect();
  }
}

const defaultLongitude = -74.0060;  // NYC longitude
const defaultLatitude = 40.7128;    // NYC latitude
const defaultRadius = 50;           // 50km radius

const longitude = parseFloat(process.argv[2]) || defaultLongitude;
const latitude = parseFloat(process.argv[3]) || defaultLatitude;
const radius = parseFloat(process.argv[4]) || defaultRadius;

searchBooks([longitude, latitude], radius)
  .catch(console.error);