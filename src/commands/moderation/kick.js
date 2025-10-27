import { REST } from '@yurbajs/rest';
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

      const dialog = await Dialog.findById(message.Dialog.ID);
      if (!dialog || !dialog.token) {
        return message.reply('❌ Токен не встановлено для цього діалогу');
      }

      const api = new REST(dialog.token, { debug:true });
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