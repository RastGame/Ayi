import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'yurba.js';
import { initFont } from './utils/font.js';
import { loadCommands, loadEvents } from './utils/loader.js';
import { logger } from './utils/logger.js';
import { initConfig } from './config/config.js';
import './utils/healthCheck.js';
import { ErrorHandler } from './utils/errorHandler.js';
import pkg from '../package.json' with { type: 'json' };

// Показуємо заголовок ініціалізації
logger.box('INITIALIZING BOT', logger.colors.brightCyan);

// Інформація про бот
logger.section('Bot Information', [
  `${logger.colors.green}Name:${logger.colors.reset} ${pkg.name}`,
  `${logger.colors.green}Version:${logger.colors.reset} ${pkg.version}`,
  `${logger.colors.green}Author:${logger.colors.reset} ${pkg.author}`,
  `${logger.colors.green}Description:${logger.colors.reset} ${pkg.description || 'Yurba.js bot with advanced features'}`
]);

// Ініціалізація конфігурації
initConfig();

const client = new Client(process.env.YURBA_TOKEN, { prefix: process.env.YURBA_PREFIX});

// Ініціалізація шрифтів
logger.time('fonts');
await initFont();
const fontTime = logger.timeEnd('fonts');
logger.info(`${logger.colors.green}✅ Fonts initialized in ${fontTime}ms${logger.colors.reset}`);

// Завантаження команд
logger.box('LOADING COMMANDS', logger.colors.cyan);
logger.time('commands');
const commandStats = await loadCommands(client);
const commandTime = logger.timeEnd('commands');

// Статистика команд
logger.stats('Command loading statistics', commandStats.success, commandStats.errors, commandTime);

// Завантаження подій
logger.box('LOADING EVENTS', logger.colors.cyan);
logger.time('events');
const eventStats = await loadEvents(client);
const eventTime = logger.timeEnd('events');

// Статистика подій
logger.stats('Event loading statistics', eventStats.success, eventStats.errors, eventTime);

// Підключення до API
logger.info(`${logger.colors.yellow}⚡ Connecting to Yurba API...${logger.colors.reset}`);
client.init();

// Обробка критичних помилок
process.on('uncaughtException', (error) => {
  ErrorHandler.handleCriticalError(error, 'uncaughtException');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  ErrorHandler.handleCriticalError(new Error(reason), 'unhandledRejection');
});

process.on('SIGTERM', () => {
  logger.info('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
