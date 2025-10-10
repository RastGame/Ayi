import pkg from '../../../package.json' with { type: 'json' };

export default {
  name: 'info',
  handler: async (client, message) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const infoText = [
      `🧭 **Ayi v${pkg.version}**`,
      `👨‍💻 Розробник: **@${pkg.author}**`,
      `🧩 Команд: **${client.getCommands().length || 'N/A'}**`,
      ``, 
      `📊 **Статистика:**`,
      `• Аптайм: ${hours}г ${minutes}хв ${seconds}с`,
      `• Пам’ять: ${memUsage} MB`,
      `• Node.js: ${process.version}`
    ].join('\n');

    await message.reply(infoText);
  }
};
