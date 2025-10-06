import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders, deleteOrder } from '../controllers/order.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
import { isAdmin, isUser } from '../middlewares/authorization.middleware.js';
import { validateOrderId, validateUpdateOrderStatus } from '../middlewares/validation.middleware.js';

const router = express.Router();

// User routes
router.post('/', authRequired, isUser, createOrder);
router.get('/', authRequired, isUser, getUserOrders);
router.get('/:id', authRequired, isUser, validateOrderId, getOrderById);

// Admin routes
router.patch('/:id/status', 
    authRequired, 
    isAdmin, 
    validateOrderId, 
    validateUpdateOrderStatus, 
    updateOrderStatus
);
router.get('/admin', authRequired, isAdmin, getAllOrders);
router.delete('/:id', authRequired, isAdmin, validateOrderId, deleteOrder);

export default router;
