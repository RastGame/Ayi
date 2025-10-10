import pkg from '../../package.json' with { type: "json" };

export default {
  name: 'info',
  handler: (message) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
   
    message.reply(
      "```" +
      `┌──  Ayi v${pkg.version}
│   • Dev: @${pkg.author}
│   • Commands: ${message.client.getCommands().length}
│
├─ Статистика:
│   • Uptime:   ${hours}г ${minutes}хв ${seconds}с
│   • Memory:   ${memUsage} MB
│   • Node.js:  ${process.version}
└──────────────────────` +
      "```"
    );
  }
};