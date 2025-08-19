
import dotenv from 'dotenv';
dotenv.config();


import { Client } from 'yurba.js';
import pkg from '../package.json' with { type: "json" };
const { version, author } = pkg;

const client = new Client(process.env.TOKEN, { prefix: ''});

client.on('ready', () => {
  console.log(`Бот запущено: ${client.user.Name}`);
});

client.registerCommand('hello', {}, (message) => {
  message.reply(`Hello! @${message.Author.Link}`)
})

client.registerCommand('info', {}, (message) => {
  message.reply(`Інформація про мене: \n- Ім'я: ${client.user.Name}\n- Розробник: @${author}\n- Версія: ${version}`)
})

client.registerCommand('test3', {}, (message) => {
  message.reply(`Інформація про мене: \n- Ім'я: ${client.user.Name}\n- Розробник: @${author}\n- Версія: ${version}`)
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

client.registerCommand('sync', {}, (message) => {
  if (message.Author.ID !== 1111) {
    message.reply('❌ Access denied');
    return;
  }
  
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
})

client.registerCommand('restart', {}, (message) => {
  if (message.Author.ID !== 1111) {
    message.reply('❌ Access denied');
    return;
  }
  
  message.reply('🔄 Restarting bot...');
  process.send({ type: 'restart', userId: message.Author.ID });
})


client.init();


// import { ReconnectingWebSocket } from '@yurbajs/ws';

// const ws = new ReconnectingWebSocket(`wss://api.yurba.one/ws?token=${process.env.TOKEN}`);

// ws.on('message', (message) => {
//   console.log('\n WS ::', JSON.stringify(JSON.parse(message), null, 2));
// });

// ws.on('open', () => {
//   console.log('WebSocket connected!');
// });

// ws.on('error', (error) => {
//   console.error('WebSocket error:', error);
// });