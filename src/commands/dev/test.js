import { err, msg } from '../../utils/messages.js';

export default {
  name: 'test',
  handler: async (client, message) => {
    if (message.Author.ID !== 1111) return message.reply(err('Доступ заборонено'));

    await client.sendMessage(message.Dialog.ID, {
      text: 'Test message',
      edit: message.ID
    });

    await message.reply(msg('✅', 'Тестова команда працює!'));
  }
};