import { Dialog } from '../../models/Dialog.js';

export default {
  name: 'kick',
  args: {user: 'user'},
  cooldown: 3000,
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      if (message.Author.ID !== message.Dialog.Owner?.ID && message.Author.ID !== 1111) {
        return message.reply('❌ Тільки власник діалогу може !');
      }

      const api = await Dialog.getAPI(message.Dialog.ID);
      if (!api) {
        return message.reply('❌ Токен не встановлено для цього діалогу');
      }
      const kick = await api.dialogs.removeMember(message.Dialog.ID, args.user.ID);

      const response = `Користувача: ${args.user.Name}, Видалено`
      console.log(JSON.stringify(kick, null, 2))

      await message.reply(response)
      
    } catch (error) {
      await message.reply('❌ Помилка при видаленні користувача');
      console.error('Clear error:', error);
    }
  }
};