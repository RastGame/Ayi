import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'yurba.js';
import { connectDB, getDB } from './database.js';
import { User } from './models/User.js';
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

// Cooldown storage
const cooldowns = new Map();

// Helper function to check if user is admin
function isAdmin(message) {
  return message.Author.ID === 1111;
}

// Cooldown decorator
function withCooldown(handler, cooldownTime = 5000, maxUses = 3) {
  return (message, args) => {
    const userId = message.Author.ID;
    const now = Date.now();
    const key = `${handler.name}_${userId}`;
    
    if (!cooldowns.has(key)) {
      cooldowns.set(key, { uses: 0, resetTime: now + cooldownTime });
    }
    
    const userCooldown = cooldowns.get(key);
    
    if (now > userCooldown.resetTime) {
      userCooldown.uses = 0;
      userCooldown.resetTime = now + cooldownTime;
    }
    
    if (userCooldown.uses >= maxUses) {
      const timeLeft = Math.ceil((userCooldown.resetTime - now) / 1000);
      message.reply(`⏰ Зачекайте ${timeLeft} секунд`);
      return;
    }
    
    userCooldown.uses++;
    return handler(message, args);
  };
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

client.on('ready', async () => {
  await connectDB();
  client.sendMessage(459, { text: 'Бот запущено'})
  console.log(`Бот запущено: ${client.user.Name}`);
});

client.on('message', async (message) => {
  try {
    await User.updateById(message.Author.ID, { 
      $inc: { messageCount: 1 },
      $set: { lastActive: new Date() }
    });
  } catch (error) {
    // Ignore errors for message counting
  }
});


client.on('join', (message) => {
  message.reply('test')
})


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



import { GreetingsCard } from "./test.js";
import fs from 'fs/promises';
import path from 'path';


client.registerCommand('testcard', {}, withCooldown(async function testcard(message) {
  try {
    const avatar = await client.getPhoto(message.Author.Avatar)

    const card = new GreetingsCard()
      .setAvatar(avatar.Url)
      .setDisplayName(' ' + message.Author.Name + message.Author.Surname)
      .setType("Вітаємо")
      .setMessage("Карточка створена з використанням:")
      .setMessage2("canvacord + yurba.js")
    const imageBuffer = await card.build({ format: "png" });
    
    const photo = await client.api.photos.upload({
      photo: imageBuffer,
      filename: `card-${Date.now()}.png`,
      caption: 'Ayi card for: ' + message.Author.Link + ', ' + new Date().toLocaleString(),
      mode: 'public'
    });

    console.log('Photo uploaded:', photo);
    
    // Очищення кешу після відправки
    const userId = message.Author.ID;
    const key = `testcard_${userId}`;
    cooldowns.delete(key);
    
    await message.reply(``, [photo.ID]);
  } catch (error) {
    console.error('Error in testcard command:', error);
    message.reply('❌ An error occurred while generating the card.');
  }
}, 5000, 1));

client.registerCommand('testfont', {}, withCooldown(async function testfont(message) {
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
}));

client.registerCommand('testcmd', { 'name': 'int' }, withCooldown(function testcmd(message, args) {
  message.reply(`test: ${args.name}`)
}));

client.registerCommand('profile', {}, withCooldown(async function profile(message) {
  try {
    const user = await User.findById(message.Author.ID);
    if (!user) {
      message.reply('❌ Профіль не знайдено. Використайте /register');
      return;
    }
    message.reply(`👤 Профіль @${message.Author.Link}\n📅 Зареєстровано: ${new Date(user.createdAt).toLocaleDateString()}\n💬 Повідомлень: ${user.messageCount || 0}`);
  } catch (error) {
    console.error('Profile error:', error);
    message.reply('❌ Помилка при отриманні профілю');
  }
}));

client.registerCommand('register', {}, withCooldown(async function register(message) {
  try {
    const existing = await User.findById(message.Author.ID);
    if (existing) {
      message.reply('✅ Ви вже зареєстровані!');
      return;
    }
    
    await User.create({
      _id: message.Author.ID,
      name: message.Author.Name,
      surname: message.Author.Surname,
      link: message.Author.Link,
      createdAt: new Date(),
      messageCount: 1
    });
    
    message.reply('🎉 Реєстрація успішна!');
  } catch (error) {
    console.error('Register error:', error);
    message.reply('❌ Помилка при реєстрації');
  }
}));

client.registerCommand('stats', {}, adminOnly(async function stats(message) {
  try {
    const db = getDB();
    const totalUsers = await db.collection('users').countDocuments();
    const totalMessages = await db.collection('users').aggregate([
      { $group: { _id: null, total: { $sum: '$messageCount' } } }
    ]).toArray();
    
    message.reply(`📊 Статистика бота:\n👥 Користувачів: ${totalUsers}\n💬 Повідомлень: ${totalMessages[0]?.total || 0}`);
  } catch (error) {
    console.error('Stats error:', error);
    message.reply('❌ Помилка при отриманні статистики');
  }
}));

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