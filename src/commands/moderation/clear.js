import { REST } from '@yurbajs/rest';
import { Dialog } from '../../models/Dialog.js';

export default {
  name: 'clear',
  args: {count: 'int'},
  cooldown: 30000,
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      const { count } = args;
      if (count < 1 || count > 40) {
        return message.reply('❌ Кількість повідомлень має бути від 1 до 40');
      }


      if (message.Author.ID !== message.Dialog.Owner?.ID && message.Author.ID !== 1111) {
        return message.reply('❌ Тільки власник діалогу може !');
      }

      const dialog = await Dialog.findById(message.Dialog.ID);
      if (!dialog || !dialog.token) {
        return message.reply('❌ Токен не встановлено для цього діалогу');
      }

      
      const api = new REST(dialog.token, { debug:true });

      await message.reply("Видалення... \n- Статус «пише» означає що бот зараз видаляє")

      
      let allMessages = [];
      let lastId = message.ID;
      
      // Отримуємо повідомлення порціями по 20
      while (allMessages.length < count) {
        const messages = await api.dialogs.getMessages(message.Dialog.ID, lastId);
        if (!messages.length) break;
        
        allMessages.push(...messages);
        lastId = messages[messages.length - 1].ID;
      }
      
      const messagesToDelete = allMessages.slice(0, count);
      console.log(`Found ${allMessages.length} messages, will delete ${messagesToDelete.length}`);
      
      let deletedCount = 0;
      let failedCount = 0;
      
      // Паралельне видалення по 5 одночасно
      for (let i = 0; i < messagesToDelete.length; i += 5) {
        const batch = messagesToDelete.slice(i, i + 5);
        const deletePromises = batch.map(async (msg) => {
          try {
            client.typing(message.Dialog.ID);
            await api.dialogs.deleteMessage(msg.ID);
            return { success: true, id: msg.ID };
          } catch (error) {
            console.log(`Failed to delete message ${msg.ID}:`, error.message);
            return { success: false, id: msg.ID };
          }
        });
        
        const results = await Promise.all(deletePromises);
        deletedCount += results.filter(r => r.success).length;
        failedCount += results.filter(r => !r.success).length;
      }
      
      console.log(`Deleted: ${deletedCount}, Failed: ${failedCount}`);
      
      return message.reply(`🗑️ Видалено ${deletedCount} повідомлень`);

    } catch (error) {
      console.error('Clear error:', error);
      message.reply('❌ Помилка при очищенні повідомлень');
    }
  }
};