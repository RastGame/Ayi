import { MongoClient } from 'mongodb';
import { logger } from '../utils/logger.js';

let client;
let db;

export async function connectDB() {
  if (!client) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db('Ayi');
    logger.info('✅ Підключено до MongoDB: Ayi');
  }
  return db;
}

export function getDB() {
  return db;
}