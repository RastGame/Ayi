/**
 * Модуль логування з використанням TintShell у стилі Discord бота
 */
import { Logger } from 'tintshell';
import path from 'path';
import fs from 'fs';

// Створення логера з налаштуваннями
const mainLogger = new Logger('AYI', process.env.LOG_LEVEL || 'info');

// Налаштовуємо логування у файл
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

mainLogger.enableFileLogging({
  filePath: path.join(logsDir, 'bot.log'),
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 3,
  append: true
});

// Кольори для зручного доступу
const colors = Logger.col;

// Таймери для вимірювання часу
const timers = {};

/**
 * Створює рамку для заголовків
 * @param {string} title - Заголовок
 * @param {string} color - Колір рамки
 * @param {string} bgColor - Колір фону (опціонально)
 * @param {number} width - Ширина рамки (опціонально)
 * @returns {string[]} Масив рядків з рамкою
 */
const box = (title, color = colors.cyan, bgColor = null, width = 0) => {
  // Якщо ширина не вказана, використовуємо довжину заголовка + 4
  const boxWidth = width > 0 ? width : Math.max(title.length + 4, 33);
  
  // Обчислюємо відступи для центрування
  const padding = Math.max(0, boxWidth - title.length - 2);
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  
  return [
    `${color}╔${'═'.repeat(boxWidth)}╗${colors.reset}`,
    `${color}║${bgColor || ''}${' '.repeat(leftPad + 1)}${title}${' '.repeat(rightPad + 1)}${bgColor ? colors.reset : ''}${color}║${colors.reset}`,
    `${color}╚${'═'.repeat(boxWidth)}╝${colors.reset}`
  ];
};

/**
 * Виводить рамку з заголовком
 */
const printBox = (title, color = colors.cyan, bgColor = null, width = 33) => {
  const boxLines = box(title, color, bgColor, width);
  boxLines.forEach(line => mainLogger.info(line));
};

/**
 * Виводить статистику завантаження
 */
const stats = (title, successCount, errorCount, timeMs) => {
  mainLogger.info(`${colors.cyan}┌─ ${title}${colors.reset}`);
  mainLogger.info(`${colors.cyan}│  ${colors.green}✓ Success: ${successCount}${colors.reset}`);
  mainLogger.info(`${colors.cyan}│  ${colors.red}❌ Errors: ${errorCount}${colors.reset}`);
  mainLogger.info(`${colors.cyan}│  ${colors.blue}⏱ Time: ${timeMs}ms${colors.reset}`);
  mainLogger.info(`${colors.cyan}└${'─'.repeat(40)}${colors.reset}`);
};

/**
 * Виводить секцію з інформацією
 */
const section = (title, items = [], showStats = false) => {
  mainLogger.info(`${colors.blue}┌─ ${colors.yellow}${title}${colors.reset}`);
  
  items.forEach((item, index) => {
    const isLast = index === items.length - 1 && !showStats;
    const prefix = isLast ? '└' : '│';
    mainLogger.info(`${colors.blue}${prefix}  ${item}${colors.reset}`);
  });
  
  if (showStats) {
    mainLogger.info(`${colors.blue}└${'─'.repeat(40)}${colors.reset}`);
  }
};

// Модуль логування
export const logger = {
  // Основні методи логування
  info: (...args) => mainLogger.info(...args),
  debug: (...args) => mainLogger.debug(...args),
  warn: (...args) => mainLogger.warn(...args),
  error: (...args) => mainLogger.error(...args),
  success: (...args) => mainLogger.success(...args),
  
  // Вимірювання часу
  time: (label) => {
    timers[label] = Date.now();
    return timers[label];
  },
  
  timeEnd: (label) => {
    if (!timers[label]) return 0;
    const duration = Date.now() - timers[label];
    delete timers[label];
    return duration;
  },
  
  // Утиліти для красивого виводу
  box: printBox,
  section,
  stats,
  
  // Кольори
  colors,
  
  // Налаштування
  setLogLevel: (level) => mainLogger.setLogLevel(level),
  getLogLevel: () => mainLogger.getLogLevel()
};