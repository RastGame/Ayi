import fs from 'fs';
import path from 'path';
import { msg } from '../../utils/messages.js';
import { processCommandData } from '../../utils/templateReplacer.js';
import { PERMS, PERM_NAMES } from '../../utils/permissions.js';

export default {
  name: 'help',
  description: 'Показує список команд або допомогу по команді',
  args: { query: { type: 'string', required: false } },
  handler: async (client, message, args) => {
    const rawCommandsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/locales/uk/commands.json'), 'utf8'));
    const prefix = client.prefix;
    
    // Обробка шаблонів
    const templateVars = {
      'a.prefix': prefix
    };
    const commandsData = processCommandData(rawCommandsData, templateVars);
    
    // Якщо вказано конкретну команду
    if (args.query) {
      // Пошук команди
      for (const [categoryName, categoryData] of Object.entries(commandsData)) {
        if (categoryData.commands[args.query]) {
          const cmd = categoryData.commands[args.query];
          const isSpecialCategory = categoryName === 'unix';
          
          const helpText = [
            `:game_die: **${cmd.description}****`,
            `╭──────────────────────────────╮`
          ];
          
          // Кастомний header або стандартний usage
          if (cmd.header) {
            helpText.push(`ᯓ ${cmd.header}`);
          } else {
            const usageLine = isSpecialCategory ? `ᯓ \`${cmd.usage}\`` : `ᯓ \`${prefix}${cmd.usage}\``;
            helpText.push(usageLine);
          }
          
          if (cmd.info) {
            helpText.push(`**\n⊹ ${cmd.info}**`);
          }
          
          if (cmd.example) {
            helpText.push('');
            const examples = Array.isArray(cmd.example) ? cmd.example : [cmd.example];
            helpText.push(msg('💡', '**Приклади:**'));
            examples.forEach(example => {
              helpText.push(isSpecialCategory ? `  ⤷ \`${example}\`` : `  ⤷ \`${prefix}${example}\``);
            });
          }
          
          // Відображення потрібних прав
          if (cmd.permissions && Array.isArray(cmd.permissions)) {
            // Перевіряємо чи є 999 (тільки власник)
            if (cmd.permissions.includes(999)) {
              helpText.push(`**\n⭑ Потрібні права:** Власник`);
            } else {
              const permNames = [];
              
              for (const perm of cmd.permissions) {
                if (PERM_NAMES[perm]) {
                  permNames.push(PERM_NAMES[perm]);
                }
              }
              
              if (permNames.length > 0) {
                helpText.push(`**\n⭑ Потрібні права:** ${permNames.join(', ')}`);
              }
            }
          }
          
          helpText.push(`╰──────────────────────────────╯`);
          
          if (!isSpecialCategory && (cmd.usage.includes('(') || cmd.usage.includes('['))) {
            helpText.push(`\n⌞\`() - не обов'язковий аргумент\`⌝\n⌞\`[] - обов'язковий аргумент\`⌝`);
          }
          
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
        const categoryDisplayName = foundCategory.name || foundCategoryName;
        const helpText = [
          `${foundCategory.emoji} **Категорія: ${categoryDisplayName}**`,
          '╭──────────────────────────────╮'
        ];
        
        for (const [commandName, commandData] of Object.entries(foundCategory.commands)) {
          helpText.push(`\n**${commandData.description}**`);
          if (foundCategoryName === 'unix') {
            helpText.push(`  ⤷ \`${commandData.usage}\``);
            if (commandData.example) {
              const firstExample = Array.isArray(commandData.example) ? commandData.example[0] : commandData.example;
              helpText.push(`  💡 \`${firstExample}\``);
            }
          } else {
            helpText.push(`  ⤷ \`${prefix}${commandData.usage}\``);
            if (commandData.example) {
              const firstExample = Array.isArray(commandData.example) ? commandData.example[0] : commandData.example;
              helpText.push(`  💡 \`${prefix}${firstExample}\``);
            }
          }
        }
        
        helpText.push('\n╰──────────────────────────────╯');
        
        // Перевіряємо чи є команди з аргументами в цій категорії
        const hasArgsInCategory = Object.values(foundCategory.commands).some(cmd => 
          cmd.usage.includes('(') || cmd.usage.includes('['));
        
        if (hasArgsInCategory) {
          helpText.push('\n ⌞\`() - не обов\'язковий аргумент\`⌝\n⌞\`[] - обов\'язковий аргумент\`⌝');
        }
        return message.reply(helpText.join('\n'));
      }
      
      return message.reply(`❌ Команду або категорію "${args.query}" не знайдено`);
    }
    
    // Загальний список команд (виключаємо unix)
    let commandsCount = 0; 
    Object.entries(commandsData).forEach(([categoryName, category]) => {
      if (categoryName !== 'unix') {
        commandsCount += Object.keys(category.commands).length;
      }
    });
    
    const helpText = [
      `:game_die: **Доступні команди \`${commandsCount}\`**`,
      '╭──────────────────────────────╮'
    ];
    
    for (const [categoryName, categoryData] of Object.entries(commandsData)) {
      const commandCount = Object.keys(categoryData.commands).length;
      
      const categoryDisplayName = categoryData.name || categoryName;
      
      if (categoryName === 'unix') {
        const items = Object.keys(categoryData.commands).map(cmd => `\`${cmd}\``).join(', ');
        helpText.push(`\n. ${categoryData.emoji} ༝ **${categoryDisplayName}**`);
        helpText.push(`${items}`);
      } else {
        const commands = Object.keys(categoryData.commands).map(cmd => `\`${prefix}${cmd}\``).join(', ');
        helpText.push(`\n₊ ${categoryData.emoji} ⊹ **${categoryDisplayName}** (${commandCount})`);
        helpText.push(`${commands}`);
      }
    } 
    
    helpText.push('\n╰──────────────────────────────╯');
    helpText.push(`⤷ \`${prefix}help [категорія/команда]\``);
    
    await message.reply(helpText.join('\n'));
  }
};