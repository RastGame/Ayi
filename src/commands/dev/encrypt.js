import crypto from 'crypto';
import { msg, err } from '../../utils/messages.js';

const key = crypto.createHash('sha256').update(process.env.ENC).digest();
const iv = crypto.randomBytes(16);

export default {
  name: 'encrypt',
  args: { text: 'string' },
  handler: async (client, message, args) => {
    if (message.Author.ID !== 1111) return message.reply(err('Доступ заборонено'));

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(args.text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    await message.reply(msg('🔐', `${iv.toString('hex')}:${encrypted}`));
  }
};