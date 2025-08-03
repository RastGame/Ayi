import { Client } from 'yurba.js';
const dotenv = require('dotenv');
dotenv.config();

const client = new Client(process.env.TOKEN);

client.on('ready', () => {
  console.log('Бот запущено з middleware:');
});

client.registerCommand('hello', {}, (message) => {
  message.reply(`Hello! @${message.Author.Link}`)
})

client.init();
