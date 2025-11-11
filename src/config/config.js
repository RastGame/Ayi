import { logger } from '../utils/logger.js';

/**
 * Конфігурація бота
 */
export const config = {
  // ID розробника (замість hardcoded 1111)
  DEVELOPER_ID: parseInt(process.env.DEVELOPER_ID) || 1111,
  
  // Налаштування логування
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Налаштування бази даних
  DB_NAME: process.env.DB_NAME || 'Ayi',
  
  // Налаштування cooldown
  DEFAULT_COOLDOWN: parseInt(process.env.DEFAULT_COOLDOWN) || 3000,
  
  // Налаштування rate limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 хвилина
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX) || 10
  },
  
  // Канали для повідомлень
  CHANNELS: {
    STARTUP: parseInt(process.env.STARTUP_CHANNEL) || 459,
    ERRORS: parseInt(process.env.ERROR_CHANNEL) || null,
    LOGS: parseInt(process.env.LOG_CHANNEL) || null
  },
  
  // Економіка
  ECONOMY: {
    DAILY_AMOUNT: parseInt(process.env.DAILY_AMOUNT) || 100,
    WORK_MIN: parseInt(process.env.WORK_MIN) || 50,
    WORK_MAX: parseInt(process.env.WORK_MAX) || 200,
    STARTING_BALANCE: parseInt(process.env.STARTING_BALANCE) || 0
  },
  
  // Рівні
  LEVELS: {
    XP_PER_MESSAGE: parseInt(process.env.XP_PER_MESSAGE) || 15,
    XP_COOLDOWN: parseInt(process.env.XP_COOLDOWN) || 60000 // 1 хвилина
  }
};

/**
 * Валідація обов'язкових змінних середовища
 */
export function validateEnvironment() {
  const required = [
    'YURBA_TOKEN',
    'YURBA_PREFIX', 
    'MONGO_URI'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    logger.error('❌ Відсутні обов\'язкові змінні середовища:', missing);
    process.exit(1);
  }
  
  logger.success('✅ Всі обов\'язкові змінні середовища присутні');
}

/**
 * Ініціалізація конфігурації
 */
export function initConfig() {
  validateEnvironment();
  
  // Встановлюємо рівень логування
  logger.setLogLevel(config.LOG_LEVEL);
  
  logger.info('📋 Конфігурація завантажена:', {
    logLevel: config.LOG_LEVEL,
    developerId: config.DEVELOPER_ID,
    dbName: config.DB_NAME
  });
}