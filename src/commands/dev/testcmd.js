export default {
  name: 'testcmd',
  args: { user: 'int', dialog: 'int' },
  handler: async (client, message, args) => {
    if (message.Author.ID !== 1111) await message.reply(`False: `);

    await client.api.dialogs.addMember(args.dialog, args.user);

    await message.reply(`True: `);
  }
};