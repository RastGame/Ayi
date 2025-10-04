import { connectDB } from '../database.js';
import { User } from '../models/User.js';

export function registerEventHandlers(client) {
  client.on('ready', async () => {
    try {
      if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI environment variable is not set');
        return;
      }
      await connectDB();
      client.sendMessage(459, { text: 'Бот запущено'})
      console.log(`Бот запущено: ${client.user.Name}`);
    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
    }
  });

  client.on('message', async (message) => {
    try {
      await User.updateById(message.Author.ID, { 
        $inc: { messageCount: 1 },
        $set: { lastActive: new Date() }
      });
    } catch (error) {
      // Ignore errors for message counting
    }
  });

  client.on('join', (message) => {
    console.log('join', message)
  });

  client.on('leave', (message) => {
    console.log('leave', message)
  });
}