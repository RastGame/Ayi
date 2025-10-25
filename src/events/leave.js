import { Welcomer } from '../models/Welcomer.js';
import { replacePlaceholders } from '../utils/placeholders.js';

export default {
  name: 'leave',
  handler: async (client, message) => {    
    console.log('MESSAGE:', message)
    const welcomer = await Welcomer.findById(message.Dialog.ID);
    if (welcomer?.goodbye?.enabled && welcomer.goodbye.text) {
      const response = replacePlaceholders(welcomer.goodbye.text, message);
      await client.sendMessage(message.Dialog.ID, { text: response, replyTo: message.ID });
    }
  }
};