import { ObjectId } from 'mongodb';
import { connectMongo } from '../../config/mongo';

export interface CoverDoc {
  _id?: ObjectId;
  bookId: string; 
  image: Buffer;  
  mimeType: string;
}

export async function saveCover(cover: CoverDoc) {
  const db = await connectMongo();
  const result = await db.collection('covers').insertOne(cover);
  return result.insertedId;
}

export async function getCoverByBookId(bookId: string) {
  const db = await connectMongo();
  return db.collection('covers').findOne({ bookId });
}

export async function deleteCoverByBookId(bookId: string) {
  const db = await connectMongo();
  return db.collection('covers').deleteOne({ bookId });
}
