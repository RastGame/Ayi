import { User } from '../../models/User.js';
import { Profile } from '../../models/Profile.js';
import { Dialog } from '../../models/Dialog.js';
import { err, msg } from '../../utils/messages.js';
import { getDB } from '../../modules/db.js';
import { LevelUtils } from '../../utils/levels.js';

export default {
  name: 'top',
  args: { type: {type: 'string', required: false} },
  handler: async (client, message, args) => {
    try {
      const isGroup = message.Dialog.Type === 'group';
      const defaultType = isGroup ? 'local' : 'global';
      const type = args.type || defaultType;

      if (!isGroup && type === 'local') {
        return message.reply(err('Локальний топ доступний тільки в групах!'));
      }

      if (type === 'local') {
        const dialog = await Dialog.findById(message.Dialog.ID);
        if (!dialog?.levels) {
          return message.reply(err('Рівні вимкнені в цій групі'));
        }

        const db = getDB();
        const users = await db.collection('users')
          .find({ '_id.dialog': message.Dialog.ID })
          .sort({ xp: -1 })
          .limit(10)
          .toArray();

        if (!users.length) {
          return message.reply(msg('📊', 'Топ порожній'));
        }

        const topList = users.map((user, index) => {
          const level = LevelUtils.getLocalLevel(user.xp);
          return `${index + 1}. @u${user._id.id} • Рівень ${level} • ${user.xp} XP`;
        }).join('\n');

        return message.reply(`📊 Топ-10 локального рейтингу:\n\n${topList}`);
      }

      if (type === 'global') {
        const db = getDB();
        const profiles = await db.collection('profiles')
          .find({})
          .sort({ xp: -1 })
          .limit(10)
          .toArray();

        if (!profiles.length) {
          return message.reply(msg('🌍', 'Глобальний топ порожній'));
        }

        const topList = profiles.map((profile, index) => {
          const level = LevelUtils.getGlobalLevel(profile.xp);
          return `${index + 1}. @u${profile._id} • Рівень ${level} • ${profile.xp} XP`;
        }).join('\n');

        return message.reply(`🌍 Топ-10 глобального рейтингу:\n\n${topList}`);
      }

      return message.reply(err('Доступні типи: local, global'));
    } catch (error) {
      console.error('Top error:', error);
      message.reply(err('Помилка при отриманні топу'));
    }
  }
};