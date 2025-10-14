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
}