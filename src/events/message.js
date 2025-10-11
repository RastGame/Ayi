import { User } from '../models/User.js';

export default {
  name: 'message',
  handler: async (client, message) => {
    try {
      if (!message.Author?.ID) return;
      
      await User.updateById(message.Author.ID, { 
        $inc: { messageCount: 1 },
        $set: { lastActive: new Date() }
      });
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  }
};