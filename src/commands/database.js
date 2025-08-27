import { withCooldown, adminOnly } from '../utils/decorators.js';
import { User } from '../models/User.js';
import { getDB } from '../database.js';

export function registerDatabaseCommands(client) {
  client.registerCommand('profile', {}, withCooldown(async function profile(message) {
    try {
      const user = await User.findById(message.Author.ID);
      if (!user) {
        message.reply('❌ Профіль не знайдено. Використайте /register');
        return;
      }
      message.reply(`👤 Профіль @${message.Author.Link}\n📅 Зареєстровано: ${new Date(user.createdAt).toLocaleDateString()}\n💬 Повідомлень: ${user.messageCount || 0}`);
    } catch (error) {
      console.error('Profile error:', error);
      message.reply('❌ Помилка при отриманні профілю');
    }
  }));

  client.registerCommand('register', {}, withCooldown(async function register(message) {
    try {
      const existing = await User.findById(message.Author.ID);
      if (existing) {
        message.reply('✅ Ви вже зареєстровані!');
        return;
      }
      
      await User.create({
        _id: message.Author.ID,
        name: message.Author.Name,
        surname: message.Author.Surname,
        link: message.Author.Link,
        createdAt: new Date(),
        messageCount: 1
      });
      
      message.reply('🎉 Реєстрація успішна!');
    } catch (error) {
      console.error('Register error:', error);
      message.reply('❌ Помилка при реєстрації');
    }
  }));

  client.registerCommand('stats', {}, adminOnly(async function stats(message) {
    try {
      const db = getDB();
      const totalUsers = await db.collection('users').countDocuments();
      const totalMessages = await db.collection('users').aggregate([
        { $group: { _id: null, total: { $sum: '$messageCount' } } }
      ]).toArray();
      
      message.reply(`📊 Статистика бота:\n👥 Користувачів: ${totalUsers}\n💬 Повідомлень: ${totalMessages[0]?.total || 0}`);
    } catch (error) {
      console.error('Stats error:', error);
      message.reply('❌ Помилка при отриманні статистики');
    }
  }));
}