export default {
  name: 'test',
  handler: async (client, message) => {
    if (message.Author.ID !== 1111) return message.reply(`False: Access denied`);

    await client.sendMessage(message.Dialog.ID, {
      text: 'Test message',
      edit: message.ID
    });

    await message.reply(`True: Test command works!`);
  }
};