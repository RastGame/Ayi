import { User } from '../../models/User.js';
import { Profile } from '../../models/Profile.js';
import { err, msg } from '../../utils/messages.js';

export default {
  name: 'deldb',
  args: { id: { type: 'int', required: true } },
  handler: async (client, message, args) => {
    try {
      // Перевірка прав (тільки власник бота)
      if (message.Author.ID !== 1111) {
        return message.reply(err('Недостатньо прав'));
      }

      const userId = args.id;

      // Видаляємо з профілів
      await Profile.deleteById(userId);
      
      // Видаляємо з усіх груп
      await User.deleteAllByUser(userId);

      return message.reply(msg('✅', `Користувача ${userId} видалено з бази даних`));
    } catch (error) {
      console.error('DelDB error:', error);
      message.reply(err('Помилка при видаленні користувача'));
    }
  }
};