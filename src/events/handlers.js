import { connectDB } from '../database.js';
import { User } from '../models/User.js';

export function registerEventHandlers(client) {
  client.on('ready', async () => {
    await connectDB();
    client.sendMessage(459, { text: 'Бот запущено'})
    console.log(`Бот запущено: ${client.user.Name}`);
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