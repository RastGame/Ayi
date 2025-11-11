import { User } from '../../models/User.js';
import { err, msg } from '../../utils/messages.js';

const jobs = [
  { name: 'програміст', min: 50, max: 200 },
  { name: 'кур\'єр', min: 30, max: 100 },
  { name: 'вчитель', min: 40, max: 150 },
  { name: 'лікар', min: 80, max: 250 },
  { name: 'водій', min: 35, max: 120 },
  { name: 'кухар', min: 25, max: 90 }
];

export default {
  name: 'work',
  args: {},
  cooldown: 3600000, // 1 година
  handler: async (client, message, args) => {
    try {
      let userData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
      if (!userData) {
        await User.create(message.Dialog.ID, message.Author.ID);
        userData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
      }

      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const earnings = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
      
      await User.addBalance(message.Dialog.ID, message.Author.ID, earnings);

      await message.reply(msg('💼', `Ви попрацювали як ${job.name} і заробили ${earnings}₴!`));
    } catch (error) {
      console.error('Work error:', error);
      await message.reply(err('Помилка при роботі'));
    }
  }
};