import logger from '../config/logger.js';

// HTTP request logging middleware
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info(`${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.userId : 'unauthenticated',
    timestamp: new Date().toISOString()
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userId: req.user ? req.user.userId : 'unauthenticated',
      timestamp: new Date().toISOString()
    });
  });

  next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
    ip: req.ip,
    userId: req.user ? req.user.userId : 'unauthenticated',
    timestamp: new Date().toISOString()
  });
  
  next(err);
};