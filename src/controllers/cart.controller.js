import { 
    findCartItemByUserAndProduct, 
    createCartItem, 
    updateCartItemQuantity, 
    incrementCartItemQuantity,
    getUserCartItems,
    updateCartItem,
    deleteCartItem
} from '../services/cart.service.js';
import { AppError } from '../utils/errorHandler.js';

// Tambah item ke cart
export const addToCart = async (req, res, next) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return next(new AppError('productId dan quantity wajib diisi.', 400));
    }

    try {
        const existingItem = await findCartItemByUserAndProduct(userId, productId);

        let cartItem;

        if (existingItem) {
            // Jika sudah ada, update quantity
            cartItem = await incrementCartItemQuantity(userId, productId, quantity);
        } else {
            // Jika belum ada, buat baru
            cartItem = await createCartItem(userId, productId, quantity);
        }

        res.status(201).json({
            success: true,
            data: cartItem,
            message: 'Item berhasil ditambahkan ke cart.'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Gagal menambahkan ke cart', 500));
    }
};

// Lihat semua isi cart user
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
        next(new AppError('Gagal mengambil data cart', 500));
    }
};

// Update quantity item di cart
export const updateCartItem = async (req, res, next) => {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return next(new AppError('Minimal quantity adalah 1.', 400));
    }

    try {
        const item = await updateCartItem(userId, productId, quantity);

        res.status(200).json({
            success: true,
            data: item,
            message: 'Cart item quantity updated successfully.'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Item tidak ditemukan di cart.', 404));
    }
};

// Hapus item dari cart
export const deleteCartItem = async (req, res, next) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        await deleteCartItem(userId, productId);

        res.status(200).json({
            success: true,
            data: null,
            message: 'Item berhasil dihapus dari cart.'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Item tidak ditemukan di cart.', 404));
    }
};
