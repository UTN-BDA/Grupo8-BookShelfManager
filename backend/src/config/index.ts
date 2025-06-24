export { prisma } from './prisma';

export const mongodbUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/bookshelf';