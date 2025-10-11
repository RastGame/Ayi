export default {
  name: 'testcmd',
  args: { user: 'int', dialog: 'int' },
  handler: async (message, args) => {
    if (message.Author.ID !== 1111) return;

    await client.api.dialogs.addMember(args.dialog, args.user)

    await message.reply(`True: `);
  }
};