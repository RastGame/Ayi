import fs from 'fs';
import path from 'path';

export default {
  name: 'help',
  handler: async (client, message) => {
    const commandsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/locales/uk/commands.json'), 'utf8'));
    const prefix = client.prefix;
    
    let commandsCount = 0; 
    Object.values(commandsData).forEach(category => {
      commandsCount += Object.keys(category.commands).length;
    });
    
    const helpText = [
      `:game_die: **Доступні команди \`${commandsCount}\`**`,
      '╭───────────────────────────────╮'
    ];
    
    for (const [categoryName, categoryData] of Object.entries(commandsData)) {
      helpText.push(`\n₊ ${categoryData.emoji} ⊹ \` __${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}__\``);
      for (const [commandName, commandData] of Object.entries(categoryData.commands)) {
        helpText.push(`**${commandData.description}**`);
        helpText.push(`  ⤷ \`${prefix}${commandData.usage}\``);
      }
    } 
    
    helpText.push('\n╰───────────────────────────────╯\n⌞\`() - не обов\'зковий аргумент\`⌝\n⌞\`[] - обов\'язковий аргумент\`⌝');
    await message.reply(helpText.join('\n'));
  }
}; 