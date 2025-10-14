export default {
  name: 'addbot',
  args: { dialog: 'int' },
  handler: async (client, message, args) => {
    const dialog = await client.api.dialogs.get(args.dialog);
    console.log(JSON.stringify(dialog))

    if (dialog.Type !== 'group') {
      return await message.reply(`Бота можна додавати тільки в групи`);
    };

    if (dialog.Author.ID != message.Author.ID) {
      return await message.reply(`Аби додати бота ти маєш бути власником групи`);
    };

    if (dialog.Member) {
      return await message.reply(`Я вже є в групи`);
    }

    await client.api.dialogs.addMember(dialog.ID, client.user.ID);
    await client.sendMessage(dialog.ID, { text: `Бот успішно доданий: @${message.Author.Link}`})
    await message.reply(`Успішно! Бот доданий в групу: ${dialog.Name}`);
  }
};
