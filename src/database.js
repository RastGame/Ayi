import { MongoClient } from 'mongodb';

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
    db = client.db();
    console.log('✅ Connected to MongoDB');
  }
  return db;
}

export function getDB() {
  return db;
}