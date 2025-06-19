import { ObjectId } from 'mongodb';
import { connectMongo } from '../../config/mongo';

export interface ReviewDoc {
  _id?: ObjectId;
  bookId: string;    
  userId: string;    
  username: string;  
  content: string;    
  createdAt: Date;
}

export async function addReview(review: ReviewDoc) {
  const db = await connectMongo();
  const result = await db.collection('reviews').insertOne(review);
  return result.insertedId;
}

export async function getReviewsByBookId(bookId: string) {
  const db = await connectMongo();
  return db.collection('reviews').find({ bookId }).sort({ createdAt: -1 }).toArray();
}

export async function deleteReviewById(reviewId: string) {
  const db = await connectMongo();
  return db.collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });
}
