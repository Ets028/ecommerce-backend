import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validateCreateUser, validateLoginUser } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/register', validateCreateUser, register);
router.post('/login', validateLoginUser, login);

export default router;
