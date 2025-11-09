import { connectDB } from '../modules/db.js';
import pkg from '../../package.json' with { type: 'json' };
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
        console.error('❌ MONGO_URI environment variable is not set');
        return;
      }

      await connectDB();
      
      // Оновлення статусу з версією
      const currentStatus = `v${pkg.version} (In dev)`;
      if (client.user.Status !== currentStatus) {
        await client.api.account.update({ status: currentStatus });
      }
      
      client.sendMessage(459, { text: `Бот запущено: ${client.user.Name}`})
      console.log(`Бот запущено: ${client.user.Name}`);
    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
    }
  }
};