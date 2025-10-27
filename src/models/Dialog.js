import { getDB } from '../modules/db.js';

export class Dialog {
  static async findById(dialogId) {
    const db = getDB();
    return await db.collection('dialogs').findOne({ _id: dialogId });
  }

  static async create(dialogId, data = {}) {
    const db = getDB();
    const dialog = {
      _id: dialogId,
      token: null,
      moderation: false,
      levels: true,
      economy: true,
      ...data
    };
    return await db.collection('dialogs').insertOne(dialog);
  }

  static async updateById(dialogId, update) {
    const db = getDB();
    return await db.collection('dialogs').updateOne({ _id: dialogId }, { $set: update });
  }

  static async setToken(dialogId, token) {
    return await this.updateById(dialogId, { token });
  }

  static async setModeration(dialogId, enabled) {
    return await this.updateById(dialogId, { moderation: enabled });
  }

  static async setLevels(dialogId, enabled) {
    return await this.updateById(dialogId, { levels: enabled });
  }

  static async setEconomy(dialogId, enabled) {
    return await this.updateById(dialogId, { economy: enabled });
  }

  static async deleteById(dialogId) {
    const db = getDB();
    return await db.collection('dialogs').deleteOne({ _id: dialogId });
  }
}