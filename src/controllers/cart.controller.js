import { 
    findCartItemByUserAndProduct, 
    createCartItem, 
    updateCartItemQuantity, 
    incrementCartItemQuantity,
    getUserCartItems,
    updateCartItem as updateCartItemService,
    deleteCartItem as deleteCartItemService
} from '../services/cart.service.js';
import { AppError } from '../utils/errorHandler.js';

// Add item to cart
export const addToCart = async (req, res, next) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return next(new AppError('productId and quantity are required.', 400));
    }

    try {
        const existingItem = await findCartItemByUserAndProduct(userId, productId);

        let cartItem;

        if (existingItem) {
            // If item exists, update quantity
            cartItem = await incrementCartItemQuantity(userId, productId, quantity);
        } else {
            // If item doesn't exist, create new
            cartItem = await createCartItem(userId, productId, quantity);
        }

        res.status(201).json({
            success: true,
            data: cartItem,
            message: 'Item added to cart successfully.'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Failed to add to cart', 500));
    }
};

// View all user cart items
export const getUserCart = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        const items = await getUserCartItems(userId);

        res.status(200).json({
            success: true,
            data: items,
            message: 'Cart items retrieved successfully.'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Failed to retrieve cart data', 500));
    }
};

// Update item quantity in cart
export const updateCartItem = async (req, res, next) => {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return next(new AppError('Minimum quantity is 1.', 400));
    }

    try {
        const item = await updateCartItemService(userId, productId, quantity);

        res.status(200).json({
            success: true,
            data: item,
            message: 'Cart item quantity updated successfully.'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Item not found in cart.', 404));
    }
};

// Remove item from cart
export const deleteCartItem = async (req, res, next) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        await deleteCartItemService(userId, productId);

        res.status(200).json({
            success: true,
            data: null,
            message: 'Item removed from cart successfully.'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Item not found in cart.', 404));
    }
};
