import { readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { hasPermission } from './permissions.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cooldowns = new Map();

function checkCooldown(command, userId) {
  const key = `${command}_${userId}`;
  const now = Date.now();
  if (cooldowns.has(key)) {
    const expirationTime = cooldowns.get(key);
    if (now < expirationTime) {
      return expirationTime - now;
    }
    cooldowns.delete(key);
  }
  return 0;
}

function setCooldown(command, userId, ms) {
  const key = `${command}_${userId}`;
  cooldowns.set(key, Date.now() + ms);
}

async function loadFiles(dir, handler) {
  try {
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const path = join(dir, item.name);
      if (item.isDirectory()) {
        await loadFiles(path, handler);
      } else if (item.name.endsWith('.js')) {
        try {
          const module = await import(`file://${path}`);
          await handler(module.default, path);
        } catch (importError) {
          console.error(`[✘] Error importing ${path}:`, importError.message);
        }
      }
    }
  } catch (error) {
    // Тихо ігноруємо помилки читання папок (порожні папки тощо)
  }
}

export async function loadCommands(client, path = '../commands') {
  const commandsPath = resolve(__dirname, path);
  console.log(`Loading commands from: ${commandsPath}`);
  await loadFiles(commandsPath, (cmd, file) => {
    if (!cmd?.name || !cmd?.handler) {
      console.error(`〢 [✘] Invalid command in { ${file} }`);
      return;
    }
    const handler = async (message, args) => {
      // Перевірка прав
      if (cmd.permissions && cmd.permissions.length > 0) {
        if (cmd.groupOnly === true && message.Dialog.Type !== 'group') {
          return message.reply('❌ Команда доступна тільки в групах!');
        }
        
        const isOwner = message.Author.ID === message.Dialog.Owner?.ID;
        const isSuperAdmin = message.Author.ID === 1111;
        
        // Перевірка на власника (999)
        if (cmd.permissions.includes(999)) {
          if (!isOwner && !isSuperAdmin) {
            return message.reply('❌ Тільки власник групи може використовувати цю команду!');
          }
        } else {
          // Перевірка звичайних прав
          if (!isOwner && !isSuperAdmin) {
            const userData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
            const userPerms = userData?.permissions || 0;
            
            const hasRequiredPerms = cmd.permissions.some(perm => hasPermission(userPerms, perm));
            if (!hasRequiredPerms) {
              return message.reply('❌ Недостатньо прав для виконання команди!');
            }
          }
        }
      }
      
      // Перевірка та встановлення cooldown
      if (cmd.cooldown) {
        const cooldownTime = checkCooldown(cmd.name, message.Author.ID);
        if (cooldownTime > 0) {
          const secondsLeft = Math.ceil(cooldownTime / 1000);
          return message.reply(`⏰ Зачекайте ${secondsLeft} секунд`);
        }
        // Встановлюємо cooldown одразу
        setCooldown(cmd.name, message.Author.ID, cmd.cooldown);
      }
      
      // Виконання команди
      await cmd.handler(client, message, args);
    };
    
    client.registerCommand(cmd.name, cmd.args || {}, handler);
    console.log(`[✅] Command: < ${client.prefix}${cmd.name} >`);
  });
}

export async function loadEvents(client, path = '../events') {
  const eventsPath = resolve(__dirname, path);
  console.log(`Loading events from: ${eventsPath}`);
  await loadFiles(eventsPath, (event, file) => {
    if (!event?.name || !event?.handler) {
      console.error(`〢 [✘] Invalid event in { ${file} }`);
      return;
    }
    client[event.once ? 'once' : 'on'](event.name, (...args) => event.handler(client, ...args));
    console.log(`[✅] Event: < ${event.name} >`);
  });
}
