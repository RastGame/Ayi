export default {
  name: 'invite',
  args: { dialog: 'int', },
  handler: async (client, message, args) => {
    const dialog = await client.api.dialogs.get(args.dialog);

    if (dialog.Type !== 'group') {
      return await message.reply(`﹒:x:イ Я можу приєднатися **тільки до групи**`);
    }

    if (dialog.Author.ID !== message.Author.ID) {
      return await message.reply(`﹒:x:イ Недостатньо прав! Додати бота може **лише власник групи**`);
    }

    if (dialog.Member) {
      return await message.reply(`﹒:heart:イ Я вже перебуваю у групі`);
    }

    await client.api.dialogs.addMember(dialog.ID, client.user.ID);
    await client.sendMessage(dialog.ID, { text: `﹒:purple-fire:イ Вітаю всіх! Дякую що додали мене\n₊:jumping_cat:⊹ Додав: @${message.Author.Link}\n₊:sparkles:⊹ \`${client.prefix}start - для\`\n⤷ \`${client.prefix}help\` - Список всіх команд`})
    await message.reply(`﹒:dizzy:イ Успішно! ${dialog.Name}`);
  }
};
