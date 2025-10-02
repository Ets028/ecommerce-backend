import { findUserByEmail, createUser, validatePassword } from "../services/auth.service.js";
import { generateToken, setAuthCookie } from "../utils/auth.util.js";
import { AppError } from '../utils/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return next(new AppError("Email dan password wajib diisi.", 400));
    }

    // Cek apakah user sudah ada
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return next(new AppError("Email sudah terdaftar.", 409));
    }

    // Simpan ke database
    const user = await createUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan.",
      data: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    next(new AppError("Terjadi kesalahan pada server.", 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validasi input
    if (!email || !password) {
      return next(new AppError("Email dan password wajib diisi.", 400));
    }

    // Cek apakah user ada
    const user = await findUserByEmail(email);
    if (!user) {
      return next(new AppError("Email atau password salah.", 401));
    }

    // Verifikasi password
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Email atau password salah.", 401));
    }
    //buat token
    const token = generateToken({ userId: user.id }, "7d");
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (err) {
    console.error(err);
    next(new AppError("Terjadi kesalahan pada server.", 500));
  }
};
