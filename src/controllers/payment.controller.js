// src/controllers/payment.controller.js
import prisma from '../config/prisma.js';

export const simulatePayment = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan' });
        }

        if (order.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Order sudah dibayar' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: {
                paymentStatus: 'paid',
                status: 'processing',
                paidAt: new Date(),
            },
        });

        return res.json({
            message: 'Pembayaran berhasil disimulasikan',
            order: updatedOrder,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mensimulasikan pembayaran' });
    }
};
