export default {
  name: 'hello',
  handler: (message) => {
    message.reply(`Hello! @${message.Author.Link}`);
  }
};