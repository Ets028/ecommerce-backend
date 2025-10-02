import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/errorHandler.js';

export const isAdmin = async (req, res, next) => {
    const userId = req.user.userId; // Get userId from verified token

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true } // Only get role
        });

        if (!user) {
            return next(new AppError('User not found.', 404));
        }

        if (user.role !== 'admin') {
            return next(new AppError('Access denied. Only admin can access this endpoint.', 403));
        }

        next(); // Continue to next middleware or route handler
    } catch (error) {
        console.error(error);
        next(new AppError('Server error occurred.', 500));
    }
};