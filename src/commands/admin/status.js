import { HealthCheck } from '../../utils/healthCheck.js';
import { config } from '../../config/config.js';

export default {
  name: 'status',
  description: 'Показує статус та статистику бота',
  args: {},
  permissions: [999], // Тільки власник
  handler: async (client, message, args) => {
    const status = await HealthCheck.getFullStatus();
    
    const statusEmoji = status.status === 'healthy' ? '💚' : '🔴';
    const dbEmoji = status.checks.database.status === 'ok' ? '✅' : '❌';
    
    const statusText = `${statusEmoji} **Статус бота**

⏱️ **Час роботи:** ${status.uptime}
${dbEmoji} **База даних:** ${status.checks.database.message}

📊 **Пам'ять:**
• RSS: ${status.checks.memory.rss}
• Heap Used: ${status.checks.memory.heapUsed}
• Heap Total: ${status.checks.memory.heapTotal}

🛡️ **Rate Limiter:**
• Активних користувачів: ${status.checks.rateLimiter.activeUsers}
• Всього запитів: ${status.checks.rateLimiter.totalRequests}

⚙️ **Конфігурація:**
• Developer ID: ${config.DEVELOPER_ID}
• Log Level: ${config.LOG_LEVEL}
• Rate Limit: ${config.RATE_LIMIT.MAX_REQUESTS}/${config.RATE_LIMIT.WINDOW_MS}ms

🕐 **Перевірено:** ${new Date(status.timestamp).toLocaleString('uk-UA')}`;

    await message.reply(statusText);
  }
};