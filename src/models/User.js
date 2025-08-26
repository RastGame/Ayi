import { getDB } from '../database.js';

export class User {
  static async findById(id) {
    const db = getDB();
    return await db.collection('users').findOne({ _id: id });
  }

  static async create(userData) {
    const db = getDB();
    return await db.collection('users').insertOne(userData);
  }

  static async updateById(id, update) {
    const db = getDB();
    return await db.collection('users').updateOne({ _id: id }, { $set: update });
  }
}