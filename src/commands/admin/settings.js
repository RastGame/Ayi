import { Dialog } from '../../models/Dialog.js';

export default {
  name: 'settings',
  args: { action: 'string', setting: {type: 'string', required: false}, value: {type: 'string', required: false} },
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      const { action, setting, value } = args;
      const dialog = await Dialog.findById(message.Dialog.ID);
      if (!dialog) {
        return message.reply('❌ Діалог не знайдено в базі даних');
      }

      // Показ налаштувань
      if (action === 'show') {
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
        return message.reply(response);
      }

      // Перевірка прав власника
      if (message.Author.ID !== message.Dialog.Owner?.ID && message.Author.ID !== 1111) {
        return message.reply('❌ Тільки власник діалогу може змінювати налаштування!');
      }

      // Зміна налаштувань
      if (action === 'set') {
        if (!setting || !value) {
          return message.reply('❌ Використання: /settings set <moderation|levels|economy> <true|false>');
        }
        
        const validSettings = ['moderation', 'levels', 'economy'];
        if (!validSettings.includes(setting)) {
          return message.reply('❌ Доступні налаштування: moderation, levels, economy');
        }
        
        const boolValue = value === 'true';
        await Dialog.updateById(message.Dialog.ID, { [setting]: boolValue });
        return message.reply(`✅ ${setting} встановлено на ${boolValue ? 'увімкнено' : 'вимкнено'}`);
      }

      // Встановлення токену
      if (action === 'token') {
        if (!setting || !value) {
          return message.reply('❌ Використання: /settings token <dialog_id> <token>');
        }
        
        await Dialog.updateById(setting, { token: value });
        return message.reply('✅ Токен встановлено');
      }

      message.reply('❌ Доступні дії: show, set, token');
    } catch (error) {
      console.error('Settings error:', error);
      message.reply('❌ Помилка при роботі з налаштуваннями');
    }
  }
};