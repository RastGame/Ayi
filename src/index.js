import dotenv from 'dotenv';
dotenv.config();


import { Client } from 'yurba.js';
import pkg from '../package.json' with { type: "json" };
const { version, author } = pkg;

// Завантаження шрифту з підтримкою кирилиці
import { Font } from "canvacord";

// Спробуємо завантажити локальний шрифт DejaVuSans, якщо він існує
try {
  await Font.fromFile('./src/fonts/DejaVuSans.ttf', 'DejaVuSans');
  console.log('Шрифт DejaVuSans успішно завантажено');
} catch (error) {
  console.log('Не вдалося завантажити шрифт DejaVuSans, використовується шрифт за замовчуванням');
  Font.loadDefault();
}
const TOKEN = process.env.TOKEN

const client = new Client(TOKEN, { prefix: ''});

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



// const OFF = ['read', 'typing', 'online'];

// import { ReconnectingWebSocket } from '@yurbajs/ws';

// const ws = new ReconnectingWebSocket(`wss://api.yurba.one/ws?token=${TOKEN}`);

// ws.on('message', (data) =>  {
//   const message = JSON.parse(data);
//   if (!OFF.includes(message.Type)){
//     const formattedOutput = 
//       "```" +
//       `┌──────────────────────
// │   • Type: ${message.Type}
// └──────────────────────` +
//       "```";
    
//     client.sendMessage(489, JSON.stringify(message, null, 2) + '\n\n' + formattedOutput);
//   }
//   console.log(message)
// });


client.on('join', (message) => {
  message.reply('test')
})


client.registerCommand('hello', {}, (message) => {
  message.reply(`Hello! @${message.Author.Link}`)
})

client.registerCommand('info', {}, (message) => {
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
});



import { GreetingsCard } from "./test.js";
import fs from 'fs/promises';
import path from 'path';


client.registerCommand('testcard', {}, async (message) => {
  try {
    const avatar = await client.getPhoto(message.Author.Avatar)

    const card = new GreetingsCard()
      .setAvatar(avatar.Url)
      .setDisplayName(' ' + message.Author.Name + message.Author.Surname)
      .setType("Вітаємо")
      .setMessage("Карточка створена з використанням:")
      .setMessage2("canvacord + yurba.js")
    const imageBuffer = await card.build({ format: "png" });
    
    // Прямий HTTP запит до API
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('photo', blob, `card-${Date.now()}.png`);
    formData.append('caption', 'Ayi card for: ' + message.Author.Link + ', ' + new Date().toLocaleString());    
    formData.append('mode', 'public');

    const response = await fetch('https://api.yurba.one/photos', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'token': process.env.TOKEN
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const photo = await response.json();
    console.log('Photo uploaded:', photo);
    
    await message.reply(``, [photo.ID]);
  } catch (error) {
    console.error('Error in testcard command:', error);
    message.reply('❌ An error occurred while generating the card.');
  }
});

client.registerCommand('testfont', {}, async (message) => {
  try {
    // Створення тестової карточки
    const card = new GreetingsCard()
      .setAvatar('https://via.placeholder.com/150')
      .setDisplayName('Тест')
      .setType("Вітаємо")
      .setMessage("Тест українських літер: а б в г ґ д е є ж з и і ї й к л м н о п р с т у ф х ц ч ш щ ь ю я");
    
    const imageBuffer = await card.build({ format: "png" });
    
    // Завантаження зображення
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('photo', blob, `font-test-${Date.now()}.png`);
    formData.append('caption', 'Тест шрифту з українськими літерами');
    formData.append('mode', 'private');

    const response = await fetch('https://api.yurba.one/photos', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'token': process.env.TOKEN
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const photo = await response.json();
    console.log('Font test photo uploaded:', photo);
    
    await message.reply('Тест шрифту завершено', [photo.ID]);
  } catch (error) {
    console.error('Error in testfont command:', error);
    message.reply('❌ Помилка при тестуванні шрифту.');
  }
});

client.registerCommand('testcmd', { 'name': 'int' }, (message, args) => {
  message.reply(`test: ${args.name}`)
})

client.on('join', ( message ) => {
    console.log('join', message)
})

client.on('leave', ( message ) => {
  console.log('leave', message)
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