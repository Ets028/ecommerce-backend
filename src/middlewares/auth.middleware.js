// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';

export const authRequired = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new AppError('Unauthorized: Token not found', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId }; // Store user ID to req.user
        next();
    } catch (err) {
        console.error(err);
        return next(new AppError('Token is invalid.', 401));
    }
};

// Middleware to check if user is authenticated and get user details
export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};