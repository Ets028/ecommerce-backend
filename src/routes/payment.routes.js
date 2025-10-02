import express from 'express';
import { simulatePayment } from '../controllers/payment.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
import { isUser } from '../middlewares/authorization.middleware.js';
import { validateParams } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/:orderId/simulate', 
    authRequired, 
    isUser,
    validateParams(['orderId']), 
    simulatePayment
);

export default router;
