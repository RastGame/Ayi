import { getDB } from '../database.js';

export default {
  name: 'stats',
  handler: async (client, message) => {
    try {
      const db = getDB();
      const totalUsers = await db.collection('users').countDocuments();
      const totalMessages = await db.collection('users').aggregate([
        { $group: { _id: null, total: { $sum: '$messageCount' } } }
      ]).toArray();
      
      await message.reply(`📊 Статистика бота:\n👥 Користувачів: ${totalUsers}\n💬 Повідомлень: ${totalMessages[0]?.total || 0}`);
    } catch (error) {
      console.error('Stats error:', error);
      await  message.reply('❌ Помилка при отриманні статистики');
    }
  }
};