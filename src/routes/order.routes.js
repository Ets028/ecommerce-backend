import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders, deleteOrder } from '../controllers/order.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();


router.post('/', authRequired, createOrder);
router.get('/', authRequired, getUserOrders);
router.get('/:id', authRequired, getOrderById);
router.patch('/:id/status', authRequired, isAdmin, updateOrderStatus);
router.get('/admin/all', authRequired, isAdmin, getAllOrders);
router.delete('/admin/:id', authRequired, isAdmin, deleteOrder);


export default router;
