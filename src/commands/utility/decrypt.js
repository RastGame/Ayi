import crypto from 'crypto';
import { msg, err } from '../../utils/messages.js';

export default {
  name: 'decrypt',
  args: { key: 'string', encrypted: 'string' },
  handler: async (client, message, args) => {
    try {
      const key = crypto.createHash('sha256').update(args.key).digest();
      const [ivHex, encryptedText] = args.encrypted.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      await message.reply(msg('🔓', `\`${decrypted}\``));
    } catch {
      await message.reply(err('Помилка розшифрування'));
    }
  }
};