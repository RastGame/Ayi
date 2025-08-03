import { Client } from 'yurba.js';
import pkg from './package.json' with { type: "json" };
const { version, author } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Бот запущено: ${client.user.Name}`);
});

client.registerCommand('hello', {}, (message) => {
  message.reply(`Hello! @${message.Author.Link}`)
})

client.registerCommand('info', {}, (message) => {
  message.reply(`Інформація про мене: \n- Ім'я: ${client.user.Name}\n- Розробник: @${author}\n- Версія: ${version}`)
})

client.init();
