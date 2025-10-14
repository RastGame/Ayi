import { getDB } from '../modules/db.js';

export class Welcomer {
  static async findById(dialogId) {
    const db = getDB();
    return await db.collection('welcomers').findOne({ _id: dialogId });
  }

  static async create(dialogId, data = {}) {
    const db = getDB();
    const welcomer = {
      _id: dialogId,
      welcome: {
        enabled: false,
        text: '',
        media: {}
      },
      goodbye: {
        enabled: false,
        text: '',
        media: {}
      },
      ...data
    };
    return await db.collection('welcomers').insertOne(welcomer);
  }

  static async updateById(dialogId, update) {
    const db = getDB();
    return await db.collection('welcomers').updateOne({ _id: dialogId }, { $set: update });
  }

  static async setWelcome(dialogId, enabled, text = '', media = {}) {
    return await this.updateById(dialogId, { 
      'welcome.enabled': enabled,
      'welcome.text': text,
      'welcome.media': media
    });
  }

  static async setGoodbye(dialogId, enabled, text = '', media = {}) {
    return await this.updateById(dialogId, { 
      'goodbye.enabled': enabled,
      'goodbye.text': text,
      'goodbye.media': media
    });
  }
}