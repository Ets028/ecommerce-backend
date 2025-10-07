import passport from 'passport';
import { findUserByEmail } from '../services/auth.service.js';
import { AppError } from '../utils/errorHandler.js';
import { generateToken, setAuthCookie } from '../utils/auth.util.js';
import { getUserProfile } from '../services/user.service.js';

// Google OAuth - Initiate authentication
export const googleAuth = passport.authenticate('google');

// Google OAuth - Callback handler
export const googleAuthCallback = async (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    if (err) {
      return next(new AppError('Authentication error', 500));
    }

    if (!user) {
      return next(new AppError('Authentication failed', 401));
    }

    // Generate JWT token for the authenticated user
    const token = generateToken({ userId: user.id }, process.env.JWT_EXPIRES_IN || '7d');
    
    // Set the authentication cookie
    setAuthCookie(res, token);

    // Get the user profile data
    const profile = await getUserProfile(user.id);

    // Successful authentication
    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || profile?.avatarUrl,
          role: user.role,
          profileCompleted: profile?.profileCompleted || false,
        },
        token,
      },
    });
  })(req, res, next);
};

// Google OAuth - Success redirect
export const googleAuthSuccess = async (req, res) => {
  if (req.user) {
    // User is authenticated through Google OAuth
    const token = generateToken({ userId: req.user.id }, process.env.JWT_EXPIRES_IN || '7d');
    
    // Set the authentication cookie
    setAuthCookie(res, token);

    // Get the user profile data
    const profile = await getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          avatarUrl: req.user.avatarUrl || profile?.avatarUrl,
          role: req.user.role,
          profileCompleted: profile?.profileCompleted || false,
        },
        token,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      data: null,
    });
  }
};

// Google OAuth - Failure handler
export const googleAuthFailure = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Google authentication failed',
    data: null,
  });
};