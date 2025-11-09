export default {
  name: 'start',
  args: {},
  handler: async (client, message, args) => {
    try {
      const dialog = await client.api.dialogs.createPrivate(message.Author.ID);
      await client.sendMessage(dialog.ID, { text: 'Вітаю' });
    } catch (error) {
      console.error('Start error:', error);
    }
  }
};