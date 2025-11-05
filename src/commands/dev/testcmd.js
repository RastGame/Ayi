import { err, msg } from '../../utils/messages.js';

export default {
  name: 'testcmd',
  args: { user: 'int', dialog: 'int' },
  handler: async (client, message, args) => {
    if (message.Author.ID !== 1111) return message.reply(err('Доступ заборонено'));

    await client.api.dialogs.addMember(args.dialog, args.user);

    await message.reply(msg('✅', 'Користувача додано'));
  }
};