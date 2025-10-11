export default {
  name: 'help',
  description: 'Показує список доступних команд.',
  handler: async (client, message) => {
    const commands = client.getCommands?.() || [];
    
    const helpText = [
      ':books: **Доступні команди:**',
      '',
      ...commands.map(cmd => `• **${cmd}**`),
      '',
      'Використовуйте команди з префіксом `/`'
    ].join('\n');

    await message.reply(helpText);
  }
};