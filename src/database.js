import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB');
  }
  return db;
}

export function getDB() {
  return db;
}