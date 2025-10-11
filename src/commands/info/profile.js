import { User } from '../../models/User.js';

export default {
  name: 'profile',
  handler: async (client, message) => {
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
  }
};