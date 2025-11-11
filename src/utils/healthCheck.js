import { logger } from './logger.js';
import { getDB } from '../modules/db.js';
import { rateLimiter } from './rateLimiter.js';

/**
 * Система моніторингу здоров'я бота
 */
export class HealthCheck {
  static async checkDatabase() {
    try {
      const db = getDB();
      if (!db) return { status: 'error', message: 'Database not connected' };
      
      // Простий ping до бази
      await db.admin().ping();
      return { status: 'ok', message: 'Database connected' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  static checkMemory() {
    const usage = process.memoryUsage();
    const mb = (bytes) => Math.round(bytes / 1024 / 1024);
    
    return {
      status: 'ok',
      rss: `${mb(usage.rss)}MB`,
      heapUsed: `${mb(usage.heapUsed)}MB`,
      heapTotal: `${mb(usage.heapTotal)}MB`,
      external: `${mb(usage.external)}MB`
    };
  }

  static checkRateLimiter() {
    const stats = rateLimiter.getStats();
    return {
      status: 'ok',
      activeUsers: stats.activeUsers,
      totalRequests: stats.totalRequests
    };
  }

  static async getFullStatus() {
    const [database, memory, rateLimiter] = await Promise.all([
      this.checkDatabase(),
      Promise.resolve(this.checkMemory()),
      Promise.resolve(this.checkRateLimiter())
    ]);

    const uptime = process.uptime();
    const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

    return {
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted,
      status: database.status === 'ok' ? 'healthy' : 'unhealthy',
      checks: {
        database,
        memory,
        rateLimiter
      }
    };
  }

  static startPeriodicCheck(intervalMs = 300000) { // 5 хвилин
    setInterval(async () => {
      const status = await this.getFullStatus();
      
      if (status.status === 'unhealthy') {
        logger.error('🚨 Health check failed:', status);
      } else {
        logger.debug('💚 Health check passed:', {
          uptime: status.uptime,
          memory: status.checks.memory.heapUsed,
          activeUsers: status.checks.rateLimiter.activeUsers
        });
      }
    }, intervalMs);
  }
}

// Запускаємо періодичну перевірку
HealthCheck.startPeriodicCheck();