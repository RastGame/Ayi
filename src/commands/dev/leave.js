import { Dialog } from '../../models/Dialog.js';
import { User } from '../../models/User.js';
import { Welcomer } from '../../models/Welcomer.js';

export default {
  name: 'leave',
  args: { dialog: 'int' },
  handler: async (client, message, args) => {
    if (message.Author.ID !== 1111) await message.reply(`False: `);

    const response = await client.api.dialogs.removeMember(args.dialog, client.user.ID);

    // Видаляємо всіх користувачів групи з бази
    await User.deleteAllByDialog(args.dialog);
    // Видаляємо групу з бази
    await Dialog.deleteById(args.dialog);
    // Видаляємо welcomer групи
    await Welcomer.deleteById(args.dialog);

    await message.reply(`True: ${JSON.stringify(response, null, 2)}`);
  }
};