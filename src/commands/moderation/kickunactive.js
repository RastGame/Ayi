import { Dialog } from '../../models/Dialog.js';

function parseTime(timeStr) {
  const match = timeStr.match(/^(\d+)([hmdy])$/);
  if (!match) return null;
  
  const [, amount, unit] = match;
  const num = parseInt(amount);
  
  switch (unit) {
    case 'h': return num * 60 * 60 * 1000;
    case 'd': return num * 24 * 60 * 60 * 1000;
    case 'm': return num * 30 * 24 * 60 * 60 * 1000;
    case 'y': return num * 365 * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

export default {
  name: 'kickunactive',
  args: { time: 'string' },
  cooldown: 5000,
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      if (message.Author.ID !== message.Dialog.Owner?.ID && message.Author.ID !== 1111) {
        return message.reply('❌ Тільки власник діалогу може використовувати цю команду!');
      }

      const timeMs = parseTime(args.time);
      if (!timeMs) {
        return message.reply('❌ Неправильний формат часу! Використовуйте: 1h, 10d, 1m, 1y');
      }

      const api = await Dialog.getAPI(message.Dialog.ID);
      if (!api) {
        return message.reply('❌ Токен не встановлено для цього діалогу');
      }

      const cutoffTime = Date.now() - timeMs;
      
      await message.reply('🔍 Шукаю неактивних користувачів...');

      // Отримуємо всіх учасників діалогу
      let allMembers = [];
      let page = 0;
      
      while (true) {
        const members = await api.dialogs.getMembers(message.Dialog.ID, page);
        allMembers.push(...members);
        
        if (members.length < 10) break;
        page++;
      }

      // Фільтруємо неактивних користувачів
      const inactiveUsers = allMembers.filter(member => {
        const lastSeen = member.Member.Online.LastBeen;
        return !member.Member.Online.Online && lastSeen !== 0 && (lastSeen * 1000) < cutoffTime;
      });

      if (inactiveUsers.length === 0) {
        return message.reply('✅ Неактивних користувачів не знайдено!');
      }

      // Показуємо список неактивних користувачів
      const userList = inactiveUsers.map(u => `• ${u.Member.Name} (${u.Member.Link || 'без лінку'})`).join('\n');
      await message.reply(`📋 Знайдено ${inactiveUsers.length} неактивних користувачів:\n${userList}\n\n❓ Видалити їх? (y/Yes або n/No)`);

      // Чекаємо відповідь
      const filter = (msg) => msg.Author.ID === message.Author.ID && msg.Dialog.ID === message.Dialog.ID ;
      try {
        const response = await client.waitFor('message', filter, 600000); // 10 хвилин
        const answer = response.Text.toLowerCase();
        
        if (answer.startsWith('y')) {
          await message.reply('🔄 Видаляю користувачів...');
          
          let kicked = 0;
          for (const user of inactiveUsers) {
            try {
              await api.dialogs.removeMember(message.Dialog.ID, user.Member.ID);
              kicked++;
            } catch (error) {
              console.error(`Помилка при видаленні ${user.Member.Name}:`, error);
            }
          }
          
          await message.reply(`✅ Успішно видалено ${kicked} з ${inactiveUsers.length} користувачів`);
        } else {
          await message.reply('❌ Операцію скасовано');
        }
      } catch (error) {
        await message.reply('⏰ Час очікування вичерпано. Операцію скасовано');
      }
      
    } catch (error) {
      await message.reply('❌ Помилка при виконанні команди');
      console.error('Kickunactive error:', error);
    }
  }
};