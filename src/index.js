
import dotenv from 'dotenv';
dotenv.config();


import { Client } from 'yurba.js';
import pkg from '../package.json' with { type: "json" };
const { version, author } = pkg;

const client = new Client(process.env.TOKEN, { prefix: ''});

// Helper function to check if user is admin
function isAdmin(message) {
  return message.Author.ID === 1111;
}

// Decorator for admin-only commands
function adminOnly(handler) {
  return (message, args) => {
    if (!isAdmin(message)) {
      message.reply('❌ У вас не достатньо прав');
      return;
    }
    return handler(message, args);
  };
}

client.on('ready', () => {
  client.sendMessage(459, 'Бот онлайн')
  console.log(`Бот запущено: ${client.user.Name}`);
});

client.registerCommand('hello', {}, (message) => {
  message.reply(`Hello! @${message.Author.Link}`)
})

client.registerCommand('info', {}, (message) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  
  message.reply(`**Інформація про мене:**
- Ім'я: ${client.user.Name}
- Розробник: @${author}
- Версія: ${version}

**Статистика:**
- Час роботи: ${hours}г ${minutes}хв ${seconds}с
- Використання пам'яті: ${memUsage} MB
- Node.js: ${process.version}
- Команд: ${client.getCommands().length}
  `);
})


client.registerCommand('test', { 'name': 'int' }, (message, args) => {
  message.reply(`test: ${args.name}`)
})

client.on('join', ( message ) => {
    console.log('join', message)
})

client.on('leave', ( message ) => {
  console.log('leave', message)
})

client.registerCommand('help', {}, (message) => {
  message.reply(`Commands: ${client.getCommands()}`)
})

client.registerCommand('sync', {}, adminOnly((message) => {
  message.reply('🔄 Syncing with GitHub...');
  process.send({ type: 'sync', userId: message.Author.ID, messageId: message.ID });
  
  const timeout = setTimeout(() => {
    message.reply('⏰ Sync timeout');
  }, 30000);
  
  const handler = (msg) => {
    if (msg.type === 'syncResult' && msg.messageId === message.ID) {
      clearTimeout(timeout);
      process.removeListener('message', handler);
      if (msg.error) {
        message.reply(`❌ Sync error: ${msg.error}`);
      } else {
        message.reply(msg.hasUpdates ? '✅ Updates found! Restarting...' : '✅ No updates found');
      }
    }
  };
  
  process.on('message', handler);
}))

client.registerCommand('restart', {}, adminOnly((message) => {
  message.reply('🔄 Restarting bot...');
  process.send({ type: 'restart', userId: message.Author.ID });
}))


client.init();