
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