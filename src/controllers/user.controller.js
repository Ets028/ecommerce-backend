// src/controllers/user.controller.js
import { prisma } from '../config/prisma.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
}