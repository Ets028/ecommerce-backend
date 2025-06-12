import { prisma } from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi.' });
        }

        // Cek apakah user sudah ada
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan ke database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user',
            }
        });

        res.status(201).json({ message: 'User berhasil didaftarkan.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi.' });
        }

        // Cek apakah user ada
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }
        //buat token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
            sameSite: 'lax',
        });

        res.status(200).json({ message: 'Login berhasil.', user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
}