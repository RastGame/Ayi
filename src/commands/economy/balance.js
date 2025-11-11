import { User } from '../../models/User.js';
import { err, msg } from '../../utils/messages.js';

export default {
  name: 'balance',
  args: { user: { type: 'user', required: false } },
  handler: async (client, message, args) => {
    try {
      const targetUser = args.user || message.Author;
      
      let userData = await User.findByDialogAndUser(message.Dialog.ID, targetUser.ID);
      if (!userData) {
        await User.create(message.Dialog.ID, targetUser.ID);
        userData = await User.findByDialogAndUser(message.Dialog.ID, targetUser.ID);
      }

      const balance = userData.balance || 0;
      const bank = userData.bank || 0;
      const total = balance + bank;

      const balanceText = [
        `💰 **Баланс ${targetUser.Name}:**`,
        `╭──────────────────────────────╮`,
        `₊ 💵 ⊹ Готівка: ${balance}₴`,
        `₊ 🏦 ⊹ Банк: ${bank}₴`,
        `₊ 💎 ⊹ Всього: ${total}₴`,
        `╰──────────────────────────────╯`
      ].join('\n');

      await message.reply(balanceText);
    } catch (error) {
      console.error('Balance error:', error);
      await message.reply(err('Помилка при отриманні балансу'));
    }
  }
};