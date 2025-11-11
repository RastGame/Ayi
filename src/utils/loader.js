import { readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { hasPermission } from './permissions.js';
import { msg } from './messages.js';
import { formatTime } from './timeFormat.js';
import { logger } from './logger.js';
import { ErrorHandler } from './errorHandler.js';
import { config } from '../config/config.js';
import { checkRateLimit } from './rateLimiter.js';

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
          logger.error(`[✘] Error importing ${path}:`, importError.message);
        }
      }
    }
  } catch (error) {
    // Тихо ігноруємо помилки читання папок (порожні папки тощо)
  }
}

export async function loadCommands(client, path = '../commands') {
  const commandsPath = resolve(__dirname, path);
  let stats = { success: 0, errors: 0, folders: {} };
  
  await loadFiles(commandsPath, (cmd, file) => {
    const relativePath = file.replace(commandsPath, '').replace(/\\/g, '/');
    const folderName = relativePath.split('/')[1] || 'root';
    
    if (!stats.folders[folderName]) {
      stats.folders[folderName] = { success: 0, errors: 0, commands: [] };
    }
    
    if (!cmd?.name || !cmd?.handler) {
      logger.warn(`⚠️ ${relativePath} - missing "name" or "handler" property`);
      stats.errors++;
      stats.folders[folderName].errors++;
      return;
    }
    const handler = async (message, args) => {
      // Перевірка rate limit
      const rateLimit = checkRateLimit(message.Author.ID);
      if (!rateLimit.allowed) {
        const resetInSeconds = Math.ceil(rateLimit.resetIn / 1000);
        return message.reply(`⏱️ Забагато запитів! Спробуйте через ${resetInSeconds} секунд.`);
      }
      
      // Перевірка прав
      if (cmd.permissions && cmd.permissions.length > 0) {
        if (cmd.groupOnly === true && message.Dialog.Type !== 'group') {
          return message.reply('❌ Команда доступна тільки в групах!');
        }
        
        const isOwner = message.Author.ID === message.Dialog.Owner?.ID;
        const isSuperAdmin = message.Author.ID === config.DEVELOPER_ID;
        
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
          const formattedTime = formatTime(cooldownTime);
          return message.reply(msg('⏰', `Зачекайте ${formattedTime}`));
        }
        // Встановлюємо cooldown одразу
        setCooldown(cmd.name, message.Author.ID, cmd.cooldown);
      }
      
      // Виконання команди з обробкою помилок
      try {
        await cmd.handler(client, message, args);
      } catch (error) {
        await ErrorHandler.handleCommandError(error, message, cmd.name);
      }
    };
    
    client.registerCommand(cmd.name, cmd.args || {}, handler);
    
    const description = cmd.description || 'No description provided';
    const truncatedDesc = description.length > 50 ? description.substring(0, 47) + '...' : description;
    
    stats.success++;
    stats.folders[folderName].success++;
    stats.folders[folderName].commands.push({
      name: cmd.name,
      description: truncatedDesc,
      permissions: cmd.permissions || [],
      cooldown: cmd.cooldown || 0
    });
  });
  
  // Виводимо команди по папкам
  Object.entries(stats.folders).forEach(([folderName, folderStats]) => {
    if (folderStats.success === 0 && folderStats.errors === 0) return;
    
    const items = [];
    folderStats.commands.forEach(cmd => {
      items.push(`${logger.colors.green}✓ ${logger.colors.yellow}${client.prefix}${cmd.name} ${logger.colors.reset}- ${cmd.description}`);
    });
    
    if (folderStats.errors > 0) {
      items.push(`${logger.colors.yellow}⚠️ ${folderStats.errors} error(s) in this folder${logger.colors.reset}`);
    }
    
    logger.info(`${logger.colors.blue}┌─ 📁 ${logger.colors.cyan}${folderName}${logger.colors.reset}`);
    items.forEach((item, index) => {
      const prefix = '│';
      logger.info(`${logger.colors.blue}${prefix}  ${item}`);
    });
    if (items.length > 0) {
      logger.info(`${logger.colors.blue}└${'─'.repeat(40)}${logger.colors.reset}`);
    }
  });
  
  return stats;
}

export async function loadEvents(client, path = '../events') {
  const eventsPath = resolve(__dirname, path);
  let stats = { success: 0, errors: 0, folders: {} };
  
  await loadFiles(eventsPath, (event, file) => {
    const relativePath = file.replace(eventsPath, '').replace(/\\/g, '/');
    const folderName = relativePath.split('/')[1] || 'root';
    
    if (!stats.folders[folderName]) {
      stats.folders[folderName] = { success: 0, errors: 0, events: [] };
    }
    
    if (!event?.name || !event?.handler) {
      logger.warn(`⚠️ ${relativePath} - missing "name" or "handler" property`);
      stats.errors++;
      stats.folders[folderName].errors++;
      return;
    }
    
    client[event.once ? 'once' : 'on'](event.name, async (...args) => {
      try {
        await event.handler(client, ...args);
      } catch (error) {
        ErrorHandler.handleEventError(error, event.name, ...args);
      }
    });
    
    const eventType = event.once ? 'once' : 'on';
    stats.success++;
    stats.folders[folderName].success++;
    stats.folders[folderName].events.push({
      name: event.name,
      type: eventType
    });
  });
  
  // Виводимо події по папкам
  Object.entries(stats.folders).forEach(([folderName, folderStats]) => {
    if (folderStats.success === 0 && folderStats.errors === 0) return;
    
    const items = [];
    folderStats.events.forEach(event => {
      items.push(`${logger.colors.green}✓ ${logger.colors.cyan}${event.name} ${logger.colors.magenta}[${event.type}]${logger.colors.reset}`);
    });
    
    if (folderStats.errors > 0) {
      items.push(`${logger.colors.yellow}⚠️ ${folderStats.errors} error(s) in this folder${logger.colors.reset}`);
    }
    
    logger.info(`${logger.colors.blue}┌─ 📁 ${logger.colors.blue}${folderName}${logger.colors.reset}`);
    items.forEach((item, index) => {
      const prefix = '│';
      logger.info(`${logger.colors.blue}${prefix}  ${item}`);
    });
    if (items.length > 0) {
      logger.info(`${logger.colors.blue}└${'─'.repeat(40)}${logger.colors.reset}`);
    }
  });
  
  return stats;
}
