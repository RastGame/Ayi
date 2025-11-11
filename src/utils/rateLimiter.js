import { config } from '../config/config.js';
import { logger } from './logger.js';

/**
 * Система rate limiting для захисту від спаму
 */
class RateLimiter {
  constructor() {
    this.requests = new Map(); // userId -> { count, resetTime }
  }

  /**
   * Перевірка rate limit для користувача
   */
  checkLimit(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId);

    // Якщо немає записів або час скинувся
    if (!userRequests || now >= userRequests.resetTime) {
      this.requests.set(userId, {
        count: 1,
        resetTime: now + config.RATE_LIMIT.WINDOW_MS
      });
      return { allowed: true, remaining: config.RATE_LIMIT.MAX_REQUESTS - 1 };
    }

    // Якщо перевищено ліміт
    if (userRequests.count >= config.RATE_LIMIT.MAX_REQUESTS) {
      const resetIn = userRequests.resetTime - now;
      logger.warn(`Rate limit exceeded for user ${userId}, reset in ${resetIn}ms`);
      return { 
        allowed: false, 
        remaining: 0, 
        resetIn 
      };
    }

    // Збільшуємо лічильник
    userRequests.count++;
    this.requests.set(userId, userRequests);

    return { 
      allowed: true, 
      remaining: config.RATE_LIMIT.MAX_REQUESTS - userRequests.count 
    };
  }

  /**
   * Очищення старих записів (викликається періодично)
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [userId, data] of this.requests.entries()) {
      if (now >= data.resetTime) {
        this.requests.delete(userId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned ${cleaned} expired rate limit entries`);
    }
  }

  /**
   * Отримання статистики
   */
  getStats() {
    return {
      activeUsers: this.requests.size,
      totalRequests: Array.from(this.requests.values()).reduce((sum, data) => sum + data.count, 0)
    };
  }
}

// Створюємо глобальний екземпляр
export const rateLimiter = new RateLimiter();

// Очищення кожні 5 хвилин
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

/**
 * Middleware для перевірки rate limit
 */
export function checkRateLimit(userId) {
  return rateLimiter.checkLimit(userId);
}