import { Client } from 'yurba.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client(process.env.TOKEN);

client.on('ready', () => {
  console.log('Бот запущено з middleware:');
});

client.registerCommand('hello', {}, (message) => {
  message.reply(`Hello! @${message.Author.Link}`)
})

client.init();
