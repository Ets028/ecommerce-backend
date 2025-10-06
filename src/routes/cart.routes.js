import express from 'express';
import {
    addToCart,
    getUserCart,
    updateCartItem,
    deleteCartItem
} from '../controllers/cart.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
import { isUser } from '../middlewares/authorization.middleware.js';
import { 
    validateAddToCart, 
    validateCartParams, 
    validateUpdateCart 
} from '../middlewares/validation.middleware.js';

const router = express.Router();

router.use(authRequired, isUser);

router.get('/', getUserCart);
router.post('/add', 
    validateAddToCart, 
    addToCart
);
router.put('/:productId', 
    validateCartParams, 
    validateUpdateCart, 
    updateCartItem
);
router.delete('/:productId', 
    validateCartParams, 
    deleteCartItem
);

export default router;