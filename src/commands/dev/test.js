import { err, msg } from '../../utils/messages.js';

export default {
  name: 'test',
  handler: async (client, message, args) => {
    if (message.Author.ID !== 1111) return message.reply(err('Доступ заборонено'));

    await client.sendMessage(message.Dialog.ID, {
      text: 'Test message',
      edit: message.ID
    });

    console.log(JSON.stringify(client.dialogs, null, 2))
    await message.reply(msg('✅', 'Тестова команда працює!'));
  }
};