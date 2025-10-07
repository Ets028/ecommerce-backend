import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findUserByEmail, createUser } from '../services/auth.service.js';
import { createUserProfile } from '../services/user.service.js';
import { generateToken } from '../utils/auth.util.js';

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our database
        let user = await findUserByEmail(profile.emails[0].value);

        if (user) {
          // User already exists, return the user
          return done(null, user);
        }

        // Extract avatar URL from Google profile
        const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        // User doesn't exist, create a new user
        user = await createUser({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: null, // No password for OAuth users
          avatarUrl: avatarUrl, // Set avatar from Google profile
          role: 'user',
        });

        // Create user profile for the new user
        await createUserProfile(user.id, {
          // Initially empty profile; user will complete it later
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    // In a real application, you'd fetch user from database
    // For now, we'll just pass the ID since we handle JWT tokens
    done(null, { id });
  } catch (error) {
    done(error, null);
  }
});

export default passport;