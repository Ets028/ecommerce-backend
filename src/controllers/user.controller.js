// src/controllers/user.controller.js
import { findUserById } from '../services/user.service.js';
import { AppError } from '../utils/errorHandler.js';

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.userId);

        if (!user) {
            return next(new AppError('User tidak ditemukan.', 404));
        }

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
            message: 'User profile retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        next(new AppError('Terjadi kesalahan pada server.', 500));
    }
}