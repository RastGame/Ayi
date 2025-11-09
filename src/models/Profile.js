import { getDB } from '../modules/db.js';

export class Profile {
  static async findById(userId) {
    const db = getDB();
    return await db.collection('profiles').findOne({ _id: userId });
  }

  static async create(userId, data = {}) {
    const db = getDB();
    const profile = {
      _id: userId,
      xp: 0,
      coins: 0,
      premium: {
        next: null
      },
      items: {},
      date: new Date(),
      ...data
    };
    return await db.collection('profiles').insertOne(profile);
  }

  static async updateById(userId, update) {
    const db = getDB();
    return await db.collection('profiles').updateOne({ _id: userId }, { $set: update });
  }

  static async addXP(userId, amount) {
    const db = getDB();
    return await db.collection('profiles').updateOne(
      { _id: userId },
      { $inc: { xp: amount } },
      { upsert: true }
    );
  }

  static async addCoins(userId, amount) {
    const db = getDB();
    return await db.collection('profiles').updateOne(
      { _id: userId },
      { $inc: { coins: amount } },
      { upsert: true }
    );
  }

  static async setPremium(userId, nextDate) {
    return await this.updateById(userId, { 'premium.next': nextDate });
  }

  static async addItem(userId, itemKey, itemData) {
    const db = getDB();
    return await db.collection('profiles').updateOne(
      { _id: userId },
      { $set: { [`items.${itemKey}`]: itemData } },
      { upsert: true }
    );
  }

  static async deleteById(userId) {
    const db = getDB();
    return await db.collection('profiles').deleteOne({ _id: userId });
  }

}