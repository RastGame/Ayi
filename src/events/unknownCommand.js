export default {
  name: 'unknownCommand',
  handler: async (client, command, message) => {
    await message.reply(`˖ ࣪ Команда *${command}* - не знайдена. ˎˊ \n⤷ Скористайтесь: \`${client.prefix}help\``)
  }
};

