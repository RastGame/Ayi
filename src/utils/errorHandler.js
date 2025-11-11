import { logger } from './logger.js';

/**
 * Централізований обробник помилок
 */
export class ErrorHandler {
  /**
   * Обробка помилок команд
   */
  static async handleCommandError(error, message, commandName) {
    const errorId = Date.now().toString(36);
    
    logger.error(`[${errorId}] Помилка в команді ${commandName}:`, {
      error: error.message,
      stack: error.stack,
      user: message.Author.ID,
      dialog: message.Dialog.ID,
      command: commandName
    });

    // Відправляємо користувачу зрозуміле повідомлення
    try {
      await message.reply(`❌ Виникла помилка при виконанні команди.\nID помилки: \`${errorId}\``);
    } catch (replyError) {
      logger.error(`Не вдалося відправити повідомлення про помилку: ${replyError.message}`);
    }
  }

  /**
   * Обробка помилок подій
   */
  static handleEventError(error, eventName, ...args) {
    const errorId = Date.now().toString(36);
    
    logger.error(`[${errorId}] Помилка в події ${eventName}:`, {
      error: error.message,
      stack: error.stack,
      event: eventName,
      args: args.length
    });
  }

  /**
   * Обробка помилок бази даних
   */
  static handleDatabaseError(error, operation, data = {}) {
    const errorId = Date.now().toString(36);
    
    logger.error(`[${errorId}] Помилка БД в операції ${operation}:`, {
      error: error.message,
      stack: error.stack,
      operation,
      data
    });
  }

  /**
   * Обробка критичних помилок
   */
  static handleCriticalError(error, context = 'Unknown') {
    const errorId = Date.now().toString(36);
    
    logger.error(`[${errorId}] КРИТИЧНА ПОМИЛКА в ${context}:`, {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });

    // Можна додати відправку в Telegram/Discord для критичних помилок
  }
}

/**
 * Декоратор для автоматичної обробки помилок в командах
 */
export function withErrorHandling(commandName) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const [client, message] = args;
        await ErrorHandler.handleCommandError(error, message, commandName);
      }
    };
    
    return descriptor;
  };
}

/**
 * Wrapper функція для команд
 */
export function safeCommand(commandName, handler) {
  return async (client, message, args) => {
    try {
      await handler(client, message, args);
    } catch (error) {
      await ErrorHandler.handleCommandError(error, message, commandName);
    }
  };
}