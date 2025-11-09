import crypto from 'crypto';
import { msg, err } from '../../utils/messages.js';

export default {
  name: 'encrypt',
  args: { key: 'string', text: { type: 'string', rest: true } },
  handler: async (client, message, args) => {
    const key = crypto.createHash('sha256').update(args.key).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(args.text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    await message.reply(msg('🔐', `\`${iv.toString('hex')}:${encrypted}\``));
  }
};