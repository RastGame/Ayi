import { REST } from '@yurbajs/rest';
import { Dialog } from '../../models/Dialog.js';
import { err, msg } from '../../utils/messages.js';

export default {
  name: 'clear',
  args: {count: 'int', user: {type: 'user', required: false}},
  cooldown: 10000,
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply(err('Команда доступна **тільки в групах!**'));
      }

      const { count, user } = args;
      if (count < 1 || count > 40) {
        return message.reply(msg(':double-exclamation:', 'Кількість повідомлень має бути **від 1 до 40**'));
      }


      if (message.Author.ID !== message.Dialog.Owner?.ID && message.Author.ID !== 1111) {
        return message.reply(err('Недостатньо прав!'));
      }

      const dialog = await Dialog.findById(message.Dialog.ID);
      if (!dialog || !dialog.token) {
        return message.reply(err(`**Токен не встановлений** для цього діалогу\n⤷ \`${client.prefix}help token\``));
      }

      
      const api = new REST(dialog.token);
    

      const userText = user ? ` користувача @${user.Link}` : '';

      const msgdeleting = await message.reply(`🪄`)

      
      let allMessages = [];
      let lastId = message.ID;
      
      // Отримуємо повідомлення порціями по 20
      while (allMessages.length < (user ? count * 3 : count)) {
        const messages = await api.dialogs.getMessages(message.Dialog.ID, lastId);
        if (!messages.length) break;
        
        allMessages.push(...messages);
        lastId = messages[messages.length - 1].ID;
      }
      
      let messagesToDelete = user ? 
        allMessages.filter(msg => msg.Author.ID === user.ID).slice(0, count) :
        allMessages.slice(0, count);
      if (messagesToDelete.length === 0) {
        await api.dialogs.deleteMessage(msgdeleting.ID);
        return message.reply(msg(':monokle:', `Не знайдено повідомлень${userText} для видалення`));
      }
      
      let deletedCount = 0;
      let failedCount = 0;
      
      // Batch видалення - набагато швидше!
      const batch = api.batch();
      messagesToDelete.forEach((msg, index) => {
        batch.add(`msg_${index}`, api.dialogs.deleteMessage(msg.ID));
      });
      
      client.typing(message.Dialog.ID);
      const results = await batch.executeSettled();
      
      // Підрахунок результатів
      Object.values(results).forEach(result => {
        if (result.error) {
          failedCount++;
          console.log(`Failed to delete message:`, result.error.message);
        } else {
          deletedCount++;
        }
      });
      await api.dialogs.deleteMessage(msgdeleting.ID);
      console.log(`Deleted: ${deletedCount}, Failed: ${failedCount}`);
      
      const msgsucs = await message.reply(msg('🗑️', `Видалено ꔠ\`${deletedCount}/${args.count}\` повідомлень${userText} ||(видалення за 3 секунди..)||`));
      setTimeout(async ()  => {
        await api.dialogs.deleteMessage(message.ID);
        await api.dialogs.deleteMessage(msgsucs.ID);
      }, 3000);

    } catch (error) {
      console.error('Clear error:', error);
      message.reply('❌ Помилка при очищенні повідомлень');
    }
  }
};