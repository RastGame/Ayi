import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Dialog } from '../models/Dialog.js';

export default {
  name: 'message',
  handler: async (client, message) => {
    try {
      if (!message.Author?.ID) return;
      
      console.log(JSON.stringify(message, null, 2))

      // логіка на додавання користувача в базу якщо немає (Profiles)
      let profile = await Profile.findById(message.Author.ID);
      if (!profile) {
        await Profile.create(message.Author.ID);
      }

      if (message.Dialog.Type === 'group') {
        // логіка на додавання користувача в базу якщо немає (Users)
                // логіка на додвання діалогу в базу (Dialogs)
        let dialog = await Dialog.findById(message.Dialog.ID);
        if (!dialog) {
          return dialog = await Dialog.create(message.Dialog.ID);
        }
        let user = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
        if (!user) {
          await User.create(message.Dialog.ID, message.Author.ID);
        }

        // логіка на додавання користувачу xp (Users)
        const groupXP = Math.floor(Math.random() * 15) + 10; // 10-25 XP
        if (dialog.levels) await User.addXP(message.Dialog.ID, message.Author.ID, groupXP);
      }

      if (message.Dialog.Type != 'channel') {
        // логіка на додавання користувачу xp (Profiles) - менше ніж в групах
        const profileXP = Math.floor(Math.random() * 5) + 1; // 1-5 XP
        await Profile.addXP(message.Author.ID, profileXP);
      }
      
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  }
};