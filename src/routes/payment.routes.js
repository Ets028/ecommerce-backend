import express from 'express';
import { simulatePayment } from '../controllers/payment.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:orderId/simulate', authRequired, simulatePayment);

export default router;
