import { Mute } from '../../models/Mute.js';
import { PERMS } from '../../utils/permissions.js';

export default {
  name: 'mute',
  args: {user: 'user', time: 'int', reason: {type: 'string', required: false}},
  permissions: [PERMS.MUTE],
  groupOnly: true,
  handler: async (client, message, args) => {
    try {
      const { user, time, reason } = args;
      const dialogId = message.Dialog.ID;
      
      // Перевірка чи користувач вже замучений
      const existingMute = await Mute.findActive(dialogId, user.ID);
      if (existingMute) {
        return message.reply(`❌ Користувач вже замучений до ${existingMute.until.toLocaleString('uk-UA')}`);
      }



      // Додавання муту в базу
      await Mute.create(dialogId, user.ID, time, reason);
      
      const muteUntil = new Date(Date.now() + time * 60 * 1000);
      const response = [
        `🔇 Користувача ${user.Name} ${user.Surname} замучено`,
        `⏰ Тривалість: ${time} хвилин`,
        `📅 До: ${muteUntil.toLocaleString('uk-UA')}`,
        reason ? `📝 Причина: ${reason}` : ''
      ].filter(Boolean).join('\n');
      
      message.reply(response);
    } catch (error) {
      console.error('Mute error:', error);
      message.reply('❌ Помилка при накладанні муту');
    }
  }
}; 