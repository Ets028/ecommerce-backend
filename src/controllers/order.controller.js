import { 
    getCartItemsByUserId,
    createOrder as createOrderService,
    updateProductStock,
    deleteCartItemsByUserId,
    getUserOrders as getUserOrdersService,
    getOrderById as getOrderByIdService,
    updateOrderStatus as updateOrderStatusService,
    getAllOrders as getAllOrdersService,
    deleteOrder as deleteOrderService
} from "../services/order.service.js";
import { AppError } from '../utils/errorHandler.js';

export const createOrder = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        const cartItems = await getCartItemsByUserId(userId);
        if (cartItems.length === 0) {
            return next(new AppError("Cart kosong", 400));
        }

        //hitung total
        const total = cartItems.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        // cek stok
        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                return next(new AppError(`Stok produk "$(item.product.name)" tidak cukup`, 400));
            }
        }
        // buat order
        const order = await createOrderService(userId, total, cartItems);

        //kurangi stok produk
        for (const item of cartItems) {
            await updateProductStock(item.productId, item.quantity);
        }

        //hapus cart
        await deleteCartItemsByUserId(userId);

        res.status(201).json({
            success: true,
            data: order,
            message: "Order berhasil dibuat."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Gagal Membuat Order", 500));
    }
};

export const getUserOrders = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        const orders = await getUserOrdersService(userId);

        res.status(200).json({
            success: true,
            data: orders,
            message: "Daftar order berhasil diambil."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Gagal Mengambil Daftar Order", 500));
    }
};

export const getOrderById = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const order = await getOrderByIdService(id);

        if (!order || order.userId !== userId) {
            return next(new AppError("Order tidak ditemukan", 404));
        }

        res.status(200).json({
            success: true,
            data: order,
            message: "Order berhasil diambil."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Gagal Mengambil Order", 500));
    }
};

export const updateOrderStatus = async (req, res, next) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
        return next(new AppError("Status tidak valid", 400));
    }

    try {
        const updatedOrder = await updateOrderStatusService(orderId, status);

        res.status(200).json({
            success: true,
            data: updatedOrder,
            message: "Status order berhasil diupdate"
        });
    } catch (err) {
        console.error(err);
        next(new AppError("Gagal update status order", 500));
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await getAllOrdersService();

        res.status(200).json({
            success: true,
            data: orders,
            message: "Daftar order berhasil diambil."
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Gagal mengambil data order', 500));
    }
};

export const deleteOrder = async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await getOrderByIdService(id);

        if (!order) {
            return next(new AppError("Order tidak ditemukan", 404));
        }

        await deleteOrderService(id);

        res.status(200).json({
            success: true,
            data: null,
            message: "Order berhasil dihapus"
        });
    } catch (err) {
        console.error(err);
        next(new AppError("Gagal menghapus order", 500));
    }
};
