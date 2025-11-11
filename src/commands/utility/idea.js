import { err, msg } from '../../utils/messages.js';

export default {
  name: 'idea',
  args: { text: { type: 'string', required: true, rest: true } },
  cooldown: 3000,
  handler: async (client, message, args) => {
    if (!args.text) return message.reply(err('Введіть текст ідеї!'))

    try {
      const ideaText = `.💡イ**Нова ідея від:** ${message.Author.Name} ${message.Author.Surname}\n➜ (${message.Author.ID}) @${message.Author.Link} リ${message.Dialog.ID} (${message.Dialog.Type})\n\n${args.text}`;
      
      const messageData = { text: ideaText };
      if (message.Photos && message.Photos.length > 0) {
        messageData.photos_list = message.Photos;
      }
      
      await client.sendMessage(697, messageData);
      await message.reply(msg('✅', 'Ваша ідея успішно надіслана розробникам!'));
    } catch (error) {
      console.error('Idea error:', error);
      await message.reply(err('Помилка при надсиланні ідеї'));
    }
  }
};