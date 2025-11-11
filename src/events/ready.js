import { connectDB } from '../modules/db.js';
import pkg from '../../package.json' with { type: 'json' };
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';
/**
 * @typedef {import('yurba.js').Client} YurbaClient
 */

export default {
  name: 'ready',
  /**
   * @param {YurbaClient} client
   */
  handler: async (client) => {
    // console.dir(client, { depth: null, colors: true });

    try {
      if (!process.env.MONGO_URI) {
        logger.error('❌ MONGO_URI environment variable is not set');
        return;
      }

      await connectDB();
      
      // Оновлення статусу з версією
      const currentStatus = `v${pkg.version} (In dev)`;
      if (client.user.Status !== currentStatus) {
        await client.api.account.update({ status: currentStatus });
      }
      
      // Красивий вивід готовності
      logger.box('BOT READY', logger.colors.green);
      logger.section('Bot Status', [
        `${logger.colors.green}Logged in as:${logger.colors.reset} ${client.user.Name}`,
        `${logger.colors.green}User ID:${logger.colors.reset} ${client.user.ID}`,
        `${logger.colors.green}Status:${logger.colors.reset} ${currentStatus}`,
        `${logger.colors.green}Database:${logger.colors.reset} Connected`,
        `${logger.colors.green}Ready at:${logger.colors.reset} ${new Date().toLocaleString('uk-UA')}`
      ]);
      
      client.sendMessage(config.CHANNELS.STARTUP, { text: `Бот запущено: ${client.user.Name}`});
    } catch (error) {
      logger.error(`${logger.colors.red}❌ Database connection failed: ${error.message}${logger.colors.reset}`);
      logger.box('STARTUP FAILED', logger.colors.red);
    }
  }
};