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
    if (err || !user) {
      // Jika gagal, redirect ke halaman login frontend dengan pesan error
      const frontendLoginUrl = process.env.FRONTEND_URL 
                              ? `${process.env.FRONTEND_URL}/login?error=true`
                              : 'http://localhost:3000/login?error=true';
      return res.redirect(frontendLoginUrl);
    }

    try {
      const token = generateToken({ userId: user.id });
      
      setAuthCookie(res, token);

      const frontendCallbackUrl = process.env.FRONTEND_URL 
                                ? `${process.env.FRONTEND_URL}/auth/callback` 
                                : 'http://localhost:3000/auth/callback';

      return res.redirect(frontendCallbackUrl);

    } catch (error) {
      return next(new AppError('Error during token generation or redirect', 500));
    }
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