// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

export const authRequired = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId } // Simpan user ID ke req.user
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token tidak valid.' });
    }
}