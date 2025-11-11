import { getDB } from '../modules/db.js';

export class User {
  static async findByDialogAndUser(dialogId, userId) {
    const db = getDB();
    return await db.collection('users').findOne({ 
      '_id.dialog': dialogId,
      '_id.id': userId
    });
  }

  static async create(dialogId, userId, data = {}) {
    const db = getDB();
    const user = {
      _id: {
        dialog: dialogId,
        id: userId
      },
      xp: 0,
      permissions: 0,
      balance: 0,
      bank: 0,
      lastDaily: null,
      lastWork: null,
      ...data
    };
    return await db.collection('users').insertOne(user);
  }

  static async updateByDialogAndUser(dialogId, userId, update) {
    const db = getDB();
    return await db.collection('users').updateOne(
      { 
        '_id.dialog': dialogId,
        '_id.id': userId
      },
      { $set: update }
    );
  }

  static async addXP(dialogId, userId, amount) {
    const db = getDB();
    return await db.collection('users').updateOne(
      { 
        '_id.dialog': dialogId,
        '_id.id': userId
      },
      { $inc: { xp: amount } },
      { upsert: true }
    );
  }

  static async setPermissions(dialogId, userId, permissions) {
    return await this.updateByDialogAndUser(dialogId, userId, { permissions });
  }

  static async deleteByDialogAndUser(dialogId, userId) {
    const db = getDB();
    return await db.collection('users').deleteOne({
      '_id.dialog': dialogId,
      '_id.id': userId
    });
  }

  static async deleteAllByDialog(dialogId) {
    const db = getDB();
    return await db.collection('users').deleteMany({
      '_id.dialog': dialogId
    });
  }

  static async getUserRank(dialogId, userId) {
    const db = getDB();
    const user = await this.findByDialogAndUser(dialogId, userId);
    if (!user) return null;
    
    const rank = await db.collection('users').countDocuments({
      '_id.dialog': dialogId,
      xp: { $gt: user.xp }
    });
    
    return rank + 1;
  }

  static async deleteAllByUser(userId) {
    const db = getDB();
    return await db.collection('users').deleteMany({
      '_id.id': userId
    });
  }

  static async addBalance(dialogId, userId, amount) {
    const db = getDB();
    return await db.collection('users').updateOne(
      { 
        '_id.dialog': dialogId,
        '_id.id': userId
      },
      { $inc: { balance: amount } },
      { upsert: true }
    );
  }

  static async setLastDaily(dialogId, userId, timestamp) {
    return await this.updateByDialogAndUser(dialogId, userId, { lastDaily: timestamp });
  }

  static async setLastWork(dialogId, userId, timestamp) {
    return await this.updateByDialogAndUser(dialogId, userId, { lastWork: timestamp });
  }

}