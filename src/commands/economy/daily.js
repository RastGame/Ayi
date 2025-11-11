import { User } from '../../models/User.js';
import { err, msg } from '../../utils/messages.js';
import { config } from '../../config/config.js';

export default {
  name: 'daily',
  description: 'Отримати щоденну винагороду',
  args: {},
  cooldown: 86400000, // 24 години
  handler: async (client, message, args) => {
    try {
      let userData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
      if (!userData) {
        await User.create(message.Dialog.ID, message.Author.ID);
        userData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
      }

      const now = Date.now();
      const lastDaily = userData.lastDaily || 0;
      const timeDiff = now - lastDaily;

      // Перевірка вже виконується в loader.js через cooldown
      const reward = config.ECONOMY.DAILY_AMOUNT;
      
      await User.addBalance(message.Dialog.ID, message.Author.ID, reward);
      await User.setLastDaily(message.Dialog.ID, message.Author.ID, now);

      await message.reply(msg('🎁', `Ви отримали щоденну винагороду: ${reward}₴!`));
    } catch (error) {
      // Error handling тепер в loader.js
      throw error;
    }
  }
};