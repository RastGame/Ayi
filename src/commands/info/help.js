export default {
  name: 'help',
  description: 'Показує список доступних команд.',
  handler: async (client, message) => {
    const registry = client.commandRegistry || new Map();
    const categories = {};
    const commandsCount = client.getCommands?.().length || 0;
    const prefix = client.prefix;

    // Group commands by category
    for (const [name, data] of registry) {
      const category = data.category || 'general';
      if (!categories[category]) categories[category] = [];
      categories[category].push({ name, description: data.description || 'Опис відсутній' });
    }
    
    const helpText = [`:game_die: **Доступні команди \`${commandsCount}\`**`, '╭───────────────────────────────╮'];
    
    for (const [category, commands] of Object.entries(categories)) {
      helpText.push(`**${category.charAt(0).toUpperCase() + category.slice(1)}`);
      commands.forEach(cmd => helpText.push(`• \`${prefix}${cmd.name}\` - ${cmd.description}`));
      helpText.push('');
    }
    
    helpText.push('╰───────────────────────────────╯');
    await message.reply(helpText.join('\n'));
  }
};