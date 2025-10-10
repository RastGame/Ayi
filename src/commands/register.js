import { User } from '../models/User.js';

export default {
  name: 'register',
  handler: async (message) => {
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
  }
};