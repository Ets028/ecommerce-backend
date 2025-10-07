import express from 'express';
import { googleAuth, googleAuthCallback, googleAuthSuccess, googleAuthFailure } from '../controllers/googleAuth.controller.js';

const router = express.Router();

// Google OAuth routes - these will be mounted under /api/auth
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/google/success', googleAuthSuccess);
router.get('/google/failure', googleAuthFailure);

export default router;