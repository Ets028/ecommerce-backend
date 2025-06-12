import { prisma } from "../config/prisma.js";

export const createOrder = async (req, res) => {
    const userId = req.user.userId;

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        });
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart kosong" });
        }

        //hitung total
        const total = cartItems.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        // cek stok
        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                return res.status(400).json({ message: `Stok produk "$(item.product.name)" tidak cukup` });
            }
        }
        // buat order
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        //kurangi stok produk
        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: item.product.stock - item.quantity }
            });
        }

        //hapus cart
        await prisma.cartItem.deleteMany({
            where: { userId }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal Membuat Order" });
    }
};

export const getUserOrders = async (req, res) => {
    const userId = req.user.userId;

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal Mengambil Daftar Order" });
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!order || order.userId !== userId) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal Mengambil Order" });
    }
};

export const updateOrderStatus = async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const allowedStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Status tidak valid" });
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        res.json({ message: "Status order berhasil diupdate", order: updatedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal update status order" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil data order' });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
        });

        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        await prisma.order.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "Order berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghapus order" });
    }
};
