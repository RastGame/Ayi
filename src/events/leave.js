import { Welcomer } from '../models/Welcomer.js';
import { User } from '../models/User.js';
import { replacePlaceholders } from '../utils/placeholders.js';

export default {
  name: 'leave',
  handler: async (client, message) => {    
    console.log('MESSAGE:', message)
    
    // Видаляємо користувача з бази даних
    await User.deleteByDialogAndUser(message.Dialog.ID, message.Author.ID);
    
    const member = await client.api.users.get(message.Author.ID);
    const dialog = await client.api.dialogs.get(message.Dialog.ID);

    const welcomer = await Welcomer.findById(message.Dialog.ID);
    if (welcomer?.goodbye?.enabled && welcomer.goodbye.text) {
      const response = replacePlaceholders(welcomer.goodbye.text, member, dialog);
      await client.sendMessage(message.Dialog.ID, { text: response, replyTo: message.ID });
    }
  }
};