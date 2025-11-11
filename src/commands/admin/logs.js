import fs from 'fs';
import path from 'path';
import { config } from '../../config/config.js';

export default {
  name: 'logs',
  description: 'Показує останні логи бота',
  args: {
    lines: { type: 'number', default: 20 }
  },
  permissions: [999], // Тільки власник
  handler: async (client, message, args) => {
    try {
      const logsPath = path.join(process.cwd(), 'logs', 'bot.log');
      
      if (!fs.existsSync(logsPath)) {
        return message.reply('📄 Файл логів не знайдено');
      }

      const logContent = fs.readFileSync(logsPath, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      const lastLines = lines.slice(-args.lines).join('\n');

      if (lastLines.length > 1900) { // Обмеження Yurba
        const truncated = lastLines.substring(lastLines.length - 1900);
        await message.reply(`📋 **Останні ${args.lines} рядків логів:**\n\`\`\`\n...${truncated}\n\`\`\``);
      } else {
        await message.reply(`📋 **Останні ${args.lines} рядків логів:**\n\`\`\`\n${lastLines}\n\`\`\``);
      }
    } catch (error) {
      await message.reply(`❌ Помилка читання логів: ${error.message}`);
    }
  }
};