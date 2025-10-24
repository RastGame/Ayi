import { Dialog } from '../../models/Dialog.js';

export default {
  name: 'settings',
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      const dialog = await Dialog.findById(message.Dialog.ID);
      if (!dialog) {
        return message.reply('❌ Діалог не знайдено в базі даних');
      }

      const tokenStatus = dialog.token ? '🔑 Встановлено' : '❌ Відсутній';
      
      const response = [
        `⚙️ Налаштування діалогу`,
        `╭───────────────────────────────╮`,
        `₊ 🔑 ⊹ Токен: ${tokenStatus}`,
        `₊ 🛡️ ⊹ Модерація: ${dialog.moderation ? '✅' : '❌'}`,
        `₊ 📊 ⊹ Рівні: ${dialog.levels ? '✅' : '❌'}`,
        `₊ 💰 ⊹ Економіка: ${dialog.economy ? '✅' : '❌'}`,
        `╰───────────────────────────────╯`
      ].join('\n');

      message.reply(response);
    } catch (error) {
      console.error('Settings error:', error);
      message.reply('❌ Помилка при отриманні налаштувань');
    }
  }
};