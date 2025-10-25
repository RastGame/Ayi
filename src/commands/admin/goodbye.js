import { Welcomer } from '../../models/Welcomer.js';

export default {
  name: 'goodbye',
  args: { text: { type: 'string', required: false } },
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
        const currentText = welcomer.goodbye?.text || 'Не встановлено';
        return message.reply(`📝 Поточний текст прощавання:\n${currentText}`);
      }

      await Welcomer.setGoodbye(message.Dialog.ID, welcomer.goodbye?.enabled || false, args.text);
      return message.reply('✅ Текст прощавання оновлено!');
    } catch (error) {
      console.error('Goodbye text error:', error);
      message.reply('❌ Помилка при встановленні тексту прощавання');
    }
  }
};