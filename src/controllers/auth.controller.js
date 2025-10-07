import { findUserByEmail, createUser, validatePassword } from "../services/auth.service.js";
import { generateToken, setAuthCookie } from "../utils/auth.util.js";
import { AppError } from '../utils/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    // Zod validation has already been performed by middleware
    const { name, email, password } = req.validatedData;

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
    // Zod validation has already been performed by middleware
    const { email, password } = req.validatedData;

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return next(new AppError("Invalid email or password.", 401));
    }

    // Check if user has a password set (OAuth users may not have one)
    if (!user.password) {
      return next(new AppError("This account uses Google authentication. Please sign in with Google.", 400));
    }

    // Verify password for regular users
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
