// src/controllers/payment.controller.js
import { 
    getOrderById as getOrderByIdService, 
    updateOrderPaymentStatus 
} from '../services/payment.service.js';
import { AppError } from '../utils/errorHandler.js';

export const simulatePayment = async (req, res, next) => {
    const { orderId } = req.params;

    try {
        const order = await getOrderByIdService(orderId);

        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        if (order.paymentStatus === 'paid') {
            return next(new AppError('Order already paid', 400));
        }

        const updatedOrder = await updateOrderPaymentStatus(
            orderId, 
            'paid', 
            'processing', 
            new Date()
        );

        res.status(200).json({
            success: true,
            data: updatedOrder,
            message: 'Payment simulation successful'
        });
    } catch (err) {
        console.error(err);
        next(new AppError('Failed to simulate payment', 500));
    }
};
