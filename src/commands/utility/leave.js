import { Dialog } from '../../models/Dialog.js';
import { User } from '../../models/User.js';
import { Welcomer } from '../../models/Welcomer.js';
import { err, msg } from '../../utils/messages.js';

export default {
  name: 'leave',
  args: { dialog: {type: 'int', required: false} },
  handler: async (client, message, args) => {
    let dialog;
    if (args.dialog) {
      if (message.Author.ID !== 1111) return message.reply(err('Недостатньо прав!'));
      dialog = await client.api.dialogs.get(args.dialog);
    } else {
      dialog = await client.api.dialogs.get(message.Dialog.ID);
    }

    console.log(JSON.stringify(dialog, null, 2))

    if (dialog.Type !== 'group') {
      return message.reply(err('Я можу вийти **тільки з групи**'));
    }

    if (dialog.Author.ID !== message.Author.ID && message.Author.ID !== 1111) {
      return message.reply(err('Недостатньо прав! Видалити бота може **лише власник групи**'));
    }

    if (!dialog.Member) {
      return message.reply(err('Я не перебуваю у цій групі'));
    }


    await client.sendMessage(dialog.ID, {text: msg(':wave:', 'До побачення!')});

    await client.api.dialogs.leave(dialog.ID);
    await User.deleteAllByDialog(dialog.ID);
    await Dialog.deleteById(dialog.ID);
    await Welcomer.deleteById(dialog.ID);


    

  }
};