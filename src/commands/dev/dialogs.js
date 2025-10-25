import { getDB } from '../../modules/db.js';

export default {
  name: 'dialogs',
  handler: async (client, message) => {
    if (message.Author.ID !== 1111) {
      await message.reply('❌ Доступ заборонено');
      return;
    }

    const db = getDB();
    const dialogsInDB = await db.collection('dialogs').find({}, { projection: { _id: 1 } }).toArray();
    const dbDialogIds = new Set(dialogsInDB.map(d => d._id));

    const allDialogs = await client.api.dialogs.getAll() || [];
    
    let result = '📋 **Список діалогів:**\n\n';
    
    for (const dialog of allDialogs) {
      const inDB = dbDialogIds.has(dialog.ID);
      const status = inDB ? '✅' : '❌';
      result += `${status} ${dialog.ID} - ${dialog.Name || 'Без назви'} :: ${dialog.Type}\n`;
    }

    if (allDialogs.length === 0) {
      result += 'Діалогів не знайдено';
    }

    await message.reply(result);
  }
};