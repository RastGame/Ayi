import { User } from '../../models/User.js';
import { err, msg } from '../../utils/messages.js';
import { formatTime } from '../../utils/timeFormat.js';

export default {
  name: 'daily',
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

      if (timeDiff < 86400000) { // 24 години
        const timeLeft = 86400000 - timeDiff;
        const formattedTime = formatTime(timeLeft);
        return message.reply(msg('⏰', `Ви вже отримали щоденну винагороду! Повертайтесь через ${formattedTime}`));
      }

      const reward = Math.floor(Math.random() * 500) + 100; // 100-600₴
      
      await User.addBalance(message.Dialog.ID, message.Author.ID, reward);
      await User.setLastDaily(message.Dialog.ID, message.Author.ID, now);

      await message.reply(msg('🎁', `Ви отримали щоденну винагороду: ${reward}₴!`));
    } catch (error) {
      console.error('Daily error:', error);
      await message.reply(err('Помилка при отриманні щоденної винагороди'));
    }
  }
};