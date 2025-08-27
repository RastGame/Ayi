import { withCooldown } from '../utils/decorators.js';
import pkg from '../../package.json' with { type: "json" };

const { version, author } = pkg;

export function registerBasicCommands(client) {
  client.registerCommand('hello', {}, withCooldown(function hello(message) {
    message.reply(`Hello! @${message.Author.Link}`)
  }));

  client.registerCommand('info', {}, withCooldown(function info(message) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
   
    message.reply(
      "```" +
      `┌──  Ayi v${version}
│   • Dev: @${author}
│   • Commands: ${client.getCommands().length}
│
├─ Статистика:
│   • Uptime:   ${hours}г ${minutes}хв ${seconds}с
│   • Memory:   ${memUsage} MB
│   • Node.js:  ${process.version}
└──────────────────────` +
      "```"
    );
  }));

  client.registerCommand('testcmd', { 'name': 'int' }, withCooldown(function testcmd(message, args) {
    message.reply(`test: ${args.name}`)
  }));
}