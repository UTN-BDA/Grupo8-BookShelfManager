import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'bookshelf';

let isConnected = false;
export async function getMongoDb() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client.db(dbName);
}

// Portadas
export async function saveCover({ bookId, buffer, mimeType }: { bookId: string, buffer: Buffer, mimeType: string }) {
  const db = await getMongoDb();
  const result = await db.collection('covers').insertOne({ bookId, image: buffer, mimeType });
  return result.insertedId;
}

export async function getCoverByBookId(bookId: string) {
  const db = await getMongoDb();
  return db.collection('covers').findOne({ bookId });
}

// Reviews
export async function addReview({ bookId, userId, username, content }: { bookId: string, userId: string, username: string, content: string }) {
  const db = await getMongoDb();
  const createdAt = new Date();
  const result = await db.collection('reviews').insertOne({ bookId, userId, username, content, createdAt });
  return result.insertedId;
}

export async function getReviewsByBookId(bookId: string) {
  const db = await getMongoDb();
  return db.collection('reviews').find({ bookId }).sort({ createdAt: -1 }).toArray();
}
