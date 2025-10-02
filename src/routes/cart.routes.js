import express from 'express';
import {
    addToCart,
    getUserCart,
    updateCartItem,
    deleteCartItem
} from '../controllers/cart.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
import { isUser } from '../middlewares/authorization.middleware.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.use(authRequired, isUser);

router.get('/', getUserCart);
router.post('/add', 
    validateBody(['productId', 'quantity']), 
    addToCart
);
router.put('/:productId', 
    validateParams(['productId']), 
    validateBody(['quantity']), 
    updateCartItem
);
router.delete('/:productId', 
    validateParams(['productId']), 
    deleteCartItem
);

export default router;