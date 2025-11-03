import fs from 'fs';
import path from 'path';
import { msg } from '../../utils/messages.js';

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
            `:game_die: **${cmd.description}****`,
            `╭──────────────────────────────╮`,
            `ᯓ \`${prefix}${cmd.usage}\``,
            `\n **${cmd.info || ''}**`
          ];
          
          const examples = Array.isArray(cmd.example) ? cmd.example : [cmd.example];
          helpText.push(msg('💡', '**Приклади:**'));
          examples.forEach(example => {
            helpText.push(`  ⤷ \`${prefix}${example}\``);
          });
          
          helpText.push(`╰──────────────────────────────╯`, `\n⌞\`() - не обов'язковий аргумент\`⌝\n⌞\`[] - обов'язковий аргумент\`⌝`);
          return message.reply(helpText.join('\n'));
        }
      }
      
      // Пошук категорії
      let foundCategory = null;
      let foundCategoryName = null;
      
      // Прямий пошук по назві
      if (commandsData[args.query]) {
        foundCategory = commandsData[args.query];
        foundCategoryName = args.query;
      } else {
        // Пошук по аліасам
        for (const [categoryName, categoryData] of Object.entries(commandsData)) {
          if (categoryData.aliases && categoryData.aliases.includes(args.query.toLowerCase())) {
            foundCategory = categoryData;
            foundCategoryName = categoryName;
            break;
          }
        }
      }
      
      if (foundCategory) {
        const helpText = [
          `${foundCategory.emoji} **Категорія: ${foundCategoryName}**`,
          '╭──────────────────────────────╮'
        ];
        
        for (const [commandName, commandData] of Object.entries(foundCategory.commands)) {
          helpText.push(`\n**${commandData.description}**`);
          helpText.push(`  ⤷ \`${prefix}${commandData.usage}\``);
          const firstExample = Array.isArray(commandData.example) ? commandData.example[0] : commandData.example;
          helpText.push(`  💡 \`${prefix}${firstExample}\``);
        }
        
        helpText.push('\n╰──────────────────────────────╯');
        helpText.push('\n ⌞\`() - не обов\'язковий аргумент\`⌝\n⌞\`[] - обов\'язковий аргумент\`⌝');
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
      '╭──────────────────────────────╮'
    ];
    
    for (const [categoryName, categoryData] of Object.entries(commandsData)) {
      const commands = Object.keys(categoryData.commands).map(cmd => `\`${prefix}${cmd}\``).join(', ');
      const commandCount = Object.keys(categoryData.commands).length;
      helpText.push(`\n₊ ${categoryData.emoji} ⊹ **${categoryName}** (${commandCount})`);
      helpText.push(`${commands}`);
    } 
    
    helpText.push('\n╰──────────────────────────────╯');
    helpText.push(`⤷ \`${prefix}help [категорія/команда]\``);
    
    await message.reply(helpText.join('\n'));
  }
};