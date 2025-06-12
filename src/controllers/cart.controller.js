import { prisma } from '../config/prisma.js';

// Tambah item ke cart
export const addToCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'productId dan quantity wajib diisi.' });
    }

    try {
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                user_product_unique: { userId, productId }
            }
        });

        let cartItem;

        if (existingItem) {
            // Jika sudah ada, update quantity
            cartItem = await prisma.cartItem.update({
                where: {
                    uuser_product_unique: { userId, productId }
                },
                data: {
                    quantity: existingItem.quantity + quantity
                }
            });
        } else {
            // Jika belum ada, buat baru
            cartItem = await prisma.cartItem.create({
                data: {
                    userId,
                    productId,
                    quantity
                }
            });
        }

        res.status(201).json(cartItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal menambahkan ke cart' });
    }
};

// Lihat semua isi cart user
export const getUserCart = async (req, res) => {
    const userId = req.user.userId;

    try {
        const items = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true
            }
        });

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil data cart' });
    }
};

// Update quantity item di cart
export const updateCartItem = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: 'Minimal quantity adalah 1.' });
    }

    try {
        const item = await prisma.cartItem.update({
            where: {
                user_product_unique: {
                    userId,
                    productId: Number(productId)
                }
            },
            data: { quantity }
        });

        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'Item tidak ditemukan di cart.' });
    }
};

// Hapus item dari cart
export const deleteCartItem = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        await prisma.cartItem.delete({
            where: {
                user_product_unique: {
                    userId,
                    productId: Number(productId)
                }
            }
        });

        res.json({ message: 'Item berhasil dihapus dari cart.' });
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'Item tidak ditemukan di cart.' });
    }
};
