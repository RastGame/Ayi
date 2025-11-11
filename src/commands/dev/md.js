export default {
  name: 'md',
  args: { id: 'int' },
  handler: async (client, message, args) => {
    if (message.Author.ID !== 1111) {
      return message.reply('❌ Недостатньо прав');
    }
    
    try {
      await client.api.dialogs.mute(args.id);
      await message.reply('✅ Діалог замучено');
    } catch (error) {
      console.error('MD error:', error);
      await message.reply('❌ Помилка при мучені діалогу');
    }
  }
};