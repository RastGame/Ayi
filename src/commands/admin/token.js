import { Dialog } from '../../models/Dialog.js';
import { err, msg } from '../../utils/messages.js';
import { REST } from '@yurbajs/rest';
import { encryptToken } from '../../utils/crypto.js';

export default {
  name: 'token',
  args: { dialog_id: 'int', token: 'string' },
  permissions: [999],
  handler: async (client, message, args) => {
    try {
      const { dialog_id, token } = args;
      
      // Перевірка токену
      try {
        const api = new REST(token);
      } catch (error) {
        return message.reply(err('Токен не вірний'));
      }
      
      const api = new REST(token);
      
      // Перевірка чи команда в групі
      if (message.Dialog.Type === 'group') {
        await message.reply(msg('‼️', 'Автоматичній захіст від вітику токену\n⌗ Цю команду використовуємо виключно тільки в особистих повідомленнях!\n× Токен був видалений'));
        await api.account.logout();
        return;
      }
      
      // Перевірка доступу до групи
      try {
        const dialog = await api.dialogs.get(dialog_id);
        if (dialog.Author.ID !== message.Author.ID) {
          return message.reply(err('У вас немає доступу до цієї групи!'));
        }
      } catch (error) {
        console.error('Token error:', error);
        return message.reply(err('Група не знайдена або немає доступу!'));
      }

      const encryptedToken = encryptToken(token);
      
      console.log(await Dialog.updateById(dialog_id, { token: encryptedToken }))
      return message.reply(msg('✅', 'Токен встановлено'));
    } catch (error) {
      console.error('Token error:', error);
      message.reply(err('Помилка при встановленні токену'));
    }
  }
};