import { findUserByEmail, createUser, validatePassword } from "../services/auth.service.js";
import { generateToken, setAuthCookie } from "../utils/auth.util.js";
import { AppError } from '../utils/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new AppError("Email and password are required.", 400));
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return next(new AppError("Email is already registered.", 409));
    }

    // Save to database
    const user = await createUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    next(new AppError("Server error occurred.", 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return next(new AppError("Email and password are required.", 400));
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return next(new AppError("Invalid email or password.", 401));
    }

    // Verify password
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid email or password.", 401));
    }
    //generate token
    const token = generateToken({ userId: user.id }, "7d");
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful.",
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
    next(new AppError("Server error occurred.", 500));
  }
};
