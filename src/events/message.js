import { User } from '../models/User.js';

export default {
  name: 'message',
  handler: async (client, message) => {
    try {
      if (!message.Author?.ID) return;
      
      
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  }
};