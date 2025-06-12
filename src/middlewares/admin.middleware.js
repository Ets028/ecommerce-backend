import { prisma } from '../config/prisma.js';

export const isAdmin = async (req, res, next) => {
    const userId = req.user.userId; // Ambil userId dari token yang sudah diverifikasi

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true } // Hanya ambil role
        });

        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat mengakses endpoint ini.' });
        }

        next(); // Lanjutkan ke middleware berikutnya atau route handler
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
}