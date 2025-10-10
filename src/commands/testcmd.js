export default {
  name: 'testcmd',
  args: { name: 'int' },
  handler: (message, args) => {
    message.reply(`test: ${args.name}`);
  }
};