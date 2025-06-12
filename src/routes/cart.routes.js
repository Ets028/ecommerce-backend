import express from 'express';
import {
    addToCart,
    getUserCart,
    updateCartItem,
    deleteCartItem
} from '../controllers/cart.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authRequired);

router.get('/', getUserCart);
router.post('/add', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', deleteCartItem);

export default router;