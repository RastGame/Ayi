import { User } from '../../models/User.js';
import { Profile } from '../../models/Profile.js';
import { err, msg } from '../../utils/messages.js';
import { getDB, connectDB } from '../../modules/db.js';

export default {
  name: 'cleandb',
  args: { xp: { type: 'int', required: true } },
  handler: async (client, message, args) => {
    try {
      // Перевірка прав (тільки власник бота)
      if (message.Author.ID !== 1111) {
        return message.reply(err('Недостатньо прав'));
      }

      let db = getDB();
      if (!db) {
        db = await connectDB();
      }

      const xpThreshold = args.xp;

      // Отримуємо список користувачів для видалення з профілів
      const profilesToDelete = await db.collection('profiles').find({
        xp: { $lt: xpThreshold }
      }).toArray();
      
      console.log('Видаляємо профілі:', profilesToDelete.map(p => p._id));
      
      // Отримуємо список користувачів для видалення з груп
      const usersToDelete = await db.collection('users').find({
        xp: { $lt: xpThreshold }
      }).toArray();
      
      console.log('Видаляємо з груп:', usersToDelete.map(u => u._id.id));

      // Видаляємо користувачів з профілів
      const profilesResult = await db.collection('profiles').deleteMany({
        xp: { $lt: xpThreshold }
      });

      // Видаляємо користувачів з груп
      const usersResult = await db.collection('users').deleteMany({
        xp: { $lt: xpThreshold }
      });

      return message.reply(msg('✅', `Видалено ${profilesResult.deletedCount} профілів та ${usersResult.deletedCount} записів з груп (XP < ${xpThreshold})`));
    } catch (error) {
      console.error('CleanDB error:', error);
      message.reply(err('Помилка при очищенні бази даних'));
    }
  }
};