import logger from '../config/logger.js';
import { prisma } from '../config/prisma.js';

// Middleware to log database queries
export const logDatabaseQueries = () => {
  // Enable query logging for Prisma
  prisma.$use(async (params, next) => {
    const startTime = Date.now();
    
    try {
      const result = await next(params);
      const duration = Date.now() - startTime;
      
      // Log successful query
      logger.info('Database query executed', {
        model: params.model,
        action: params.action,
        durationMs: duration,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log failed query
      logger.error('Database query failed', {
        model: params.model,
        action: params.action,
        durationMs: duration,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  });
};

// Function to log specific database operations with context
export const logDBOperation = (operation, model, context = {}) => {
  logger.info(`Database operation: ${operation}`, {
    operation,
    model,
    ...context,
    timestamp: new Date().toISOString()
  });
};

// Function to log database errors
export const logDBError = (operation, model, error, context = {}) => {
  logger.error(`Database operation failed: ${operation}`, {
    operation,
    model,
    error: error.message,
    ...context,
    timestamp: new Date().toISOString()
  });
};