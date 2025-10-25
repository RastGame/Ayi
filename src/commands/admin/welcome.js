import { Welcomer } from '../../models/Welcomer.js';
import { replacePlaceholders } from '../../utils/placeholders.js';

export default {
  name: 'welcome',
  args: { text: { type: 'string', rest: true ,required: false} },
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      if (message.Author.ID !== message.Dialog.Owner?.ID && message.Author.ID !== 1111) {
        return message.reply('❌ Тільки власник діалогу може змінювати налаштування!');
      }

      let welcomer = await Welcomer.findById(message.Dialog.ID);
      if (!welcomer) {
        await Welcomer.create(message.Dialog.ID);
        welcomer = await Welcomer.findById(message.Dialog.ID);
      }

      if (!args.text) {
        const currentText = welcomer.welcome?.text || 'Не встановлено';
        return message.reply(`📝 Поточний текст привітання:\n${currentText}`);
      }

      await Welcomer.setWelcome(message.Dialog.ID, welcomer.welcome?.enabled || false, args.text);

      const response = replacePlaceholders(args.text, message);
      return message.reply(`✅ Текст привітання оновлено! \n ${response}`);
    } catch (error) {
      console.error('Welcome text error:', error);
      message.reply('❌ Помилка при встановленні тексту привітання');
    }
  }
};