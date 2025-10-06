import logger from '../config/logger.js';

// AppError class for operational errors
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  // Set default error values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error using Winston
  logger.error(`Global error handler: ${err.message}`, {
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.userId : 'unauthenticated',
    timestamp: new Date().toISOString()
  });

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Not Found Middleware
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  
  // Log 404 errors
  logger.warn(`Route not found: ${req.originalUrl}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  next(error);
};