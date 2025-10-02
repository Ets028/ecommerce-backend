import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/errorHandler.js';

// Middleware to check if user has certain roles
export const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(new AppError('Access denied. Please login first.', 401));
            }

            const user = await prisma.user.findUnique({
                where: { id: req.user.userId },
                select: { role: true }
            });

            if (!user) {
                return next(new AppError('User not found.', 404));
            }

            if (!roles.includes(user.role)) {
                return next(new AppError(`Access denied. Only ${roles.join(', ')} can access this endpoint.`, 403));
            }

            next();
        } catch (error) {
            console.error(error);
            next(new AppError('Server error occurred.', 500));
        }
    };
};

// Specific role middleware functions
export const isAdmin = authorizeRoles('admin');
export const isUser = authorizeRoles('user');
export const isAdminOrUser = authorizeRoles('admin', 'user');