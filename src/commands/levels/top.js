import { User } from '../../models/User.js';
import { Profile } from '../../models/Profile.js';
import { Dialog } from '../../models/Dialog.js';
import { err, msg } from '../../utils/messages.js';
import { getDB, connectDB } from '../../modules/db.js';
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
        let db = getDB();
        if (!db) {
          db = await connectDB();
        }
        
        const dialog = await Dialog.findById(message.Dialog.ID);
        if (!dialog?.levels) {
          return message.reply(err('Рівні вимкнені в цій групі'));
        }
        const users = await db.collection('users')
          .find({ '_id.dialog': message.Dialog.ID })
          .sort({ xp: -1 })
          .limit(10)
          .toArray();

        if (!users.length) {
          return message.reply(msg('📊', 'Топ порожній'));
        }

        const topEntries = await Promise.all(users.map(async (user, index) => {
          const level = LevelUtils.getLocalLevel(user.xp);
          try {
            const userData = await client.api.users.get(user._id.id);
            const name = userData ? userData.Name : `User${user._id.id}`;
            const link = userData ? userData.Link : `u${user._id.id}`;
            return `${index + 1}.  **${name}** ♯ @${link} ₊ \`${level}\`│*${user.xp} XP*`;
          } catch {
            return `${index + 1}.  **User${user._id.id}** ♯ @u${user._id.id} ₊ \`${level}\`│*${user.xp} XP*`;
          }
        }));

        const response = [
          `﹒📊イ Топ-10 локального рейтингу:`,
          `╭──────────────────────────────╮`,
          ...topEntries,
          `╰──────────────────────────────╯`
        ].join('\n');

        return message.reply(response);
      }

      if (type === 'global') {
        let db = getDB();
        if (!db) {
          db = await connectDB();
        }
        const profiles = await db.collection('profiles')
          .find({})
          .sort({ xp: -1 })
          .limit(10)
          .toArray();

        if (!profiles.length) {
          return message.reply(msg('🌍', 'Глобальний топ порожній'));
        }

        const topEntries = await Promise.all(profiles.map(async (profile, index) => {
          const level = LevelUtils.getGlobalLevel(profile.xp);
          try {
            const user = await client.api.users.get(profile._id);
            const name = user ? user.Name : `User${profile._id}`;
            const link = user ? user.Link : `u${profile._id}`;
            return `${index + 1}.  **${name}** ♯ @${link} ₊ \`${level}\`│*${profile.xp} XP*`;
          } catch {
            return `${index + 1}.  **User${profile._id}** ♯ @u${profile._id} ₊ \`${level}\`│*${profile.xp} XP*`;
          }
        }));
        
        const response = [
          `﹒🌍イ Топ-10 глобального рейтингу:`,
          `╭──────────────────────────────╮`,
          ...topEntries,
          `╰──────────────────────────────╯`
        ].join('\n');
        
        return message.reply(response);

      }

      return message.reply(err('Доступні типи: local, global'));
    } catch (error) {
      console.error('Top error:', error);
      message.reply(err('Помилка при отриманні топу'));
    }
  }
};