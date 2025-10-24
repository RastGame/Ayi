import { getDB } from '../modules/db.js';

export class Mute {
  static async create(dialogId, userId, duration, reason = null) {
    const db = getDB();
    const mute = {
      _id: {
        dialog: dialogId,
        user: userId
      },
      until: new Date(Date.now() + duration * 60 * 1000),
      reason,
      createdAt: new Date()
    };
    return await db.collection('mutes').insertOne(mute);
  }

  static async findActive(dialogId, userId) {
    const db = getDB();
    return await db.collection('mutes').findOne({
      '_id.dialog': dialogId,
      '_id.user': userId,
      until: { $gt: new Date() }
    });
  }

  static async remove(dialogId, userId) {
    const db = getDB();
    return await db.collection('mutes').deleteOne({
      '_id.dialog': dialogId,
      '_id.user': userId
    });
  }
}