import { Welcomer } from '../models/Welcomer.js';
import { replacePlaceholders } from '../utils/placeholders.js';

export default {
  name: 'join',
  handler: async (client, message) => {
    console.log('MESSAGE:', message)
    
    // Перевірка чи є користувач ботом
    if (message.Author?.Link?.endsWith('_bot')) return;
    
    const welcomer = await Welcomer.findById(message.Dialog.ID);
    if (welcomer?.welcome?.enabled && welcomer.welcome.text) {
      const response = replacePlaceholders(welcomer.welcome.text, message);
      await client.sendMessage(message.Dialog.ID, { text: response, replyTo: message.ID});
    }
    
  }
};