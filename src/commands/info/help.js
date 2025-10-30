import fs from 'fs';
import path from 'path';

export default {
  name: 'help',
  args: { query: { type: 'string', required: false } },
  handler: async (client, message, args) => {
    const commandsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/locales/uk/commands.json'), 'utf8'));
    const prefix = client.prefix;
    
    // Якщо вказано конкретну команду
    if (args.query) {
      // Пошук команди
      for (const [categoryName, categoryData] of Object.entries(commandsData)) {
        if (categoryData.commands[args.query]) {
          const cmd = categoryData.commands[args.query];
          const helpText = [
            `📖 **Команда: \`${args.query}\`**`,
            `╭───────────────────────────────╮`,
            `**${cmd.description}**`,
            ``,
            `📝 **Використання:**`,
            `  ⤷ \`${prefix}${cmd.usage}\``,
            ``,
            `💡 **Приклад:**`,
            `  ⤷ \`${prefix}${cmd.example}\``,
            `╰───────────────────────────────╯`
          ];
          return message.reply(helpText.join('\n'));
        }
      }
      
      // Пошук категорії
      if (commandsData[args.query]) {
        const categoryData = commandsData[args.query];
        const helpText = [
          `${categoryData.emoji} **Категорія: ${args.query}**`,
          '╭───────────────────────────────╮'
        ];
        
        for (const [commandName, commandData] of Object.entries(categoryData.commands)) {
          helpText.push(`\n**${commandData.description}**`);
          helpText.push(`  ⤷ \`${prefix}${commandData.usage}\``);
          helpText.push(`  💡 \`${prefix}${commandData.example}\``);
        }
        
        helpText.push('\n╰───────────────────────────────╯');
        return message.reply(helpText.join('\n'));
      }
      
      return message.reply(`❌ Команду або категорію "${args.query}" не знайдено`);
    }
    
    // Загальний список команд
    let commandsCount = 0; 
    Object.values(commandsData).forEach(category => {
      commandsCount += Object.keys(category.commands).length;
    });
    
    const helpText = [
      `:game_die: **Доступні команди \`${commandsCount}\`**`,
      '╭───────────────────────────────╮'
    ];
    
    for (const [categoryName, categoryData] of Object.entries(commandsData)) {
      const commands = Object.keys(categoryData.commands).map(cmd => `\`${prefix}${cmd}\``).join(', ');
      helpText.push(`\n₊ ${categoryData.emoji} ⊹ **${categoryName}**`);
      helpText.push(`${commands}`);
    } 
    
    helpText.push('\n╰───────────────────────────────╯');
    helpText.push(`⤷ \`${prefix}help [категорія]\` - команди категорії`);
    helpText.push(`⤷ \`${prefix}help [команда]\` - детально про команду`);
    helpText.push('\n⌞\`() - не обов\'язковий аргумент\`⌝\n⌞\`[] - обов\'язковий аргумент\`⌝');
    
    await message.reply(helpText.join('\n'));
  }
}; 