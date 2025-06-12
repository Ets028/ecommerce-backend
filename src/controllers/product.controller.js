import { prisma } from "../config/prisma.js";

export const createProduct = async (req, res) => {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    // Validasi input
    if (!name || !description || !price || !stock) {
        return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    try {

        // Cek apakah kategori ada
        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
            });

            if (!category) {
                return res.status(404).json({ message: "Kategori tidak ditemukan." });
            }
        }

        // Buat produk baru
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                imageUrl,
                userId: req.user.userId, // Ambil userId dari token
                categoryId: categoryId || null, // Jika tidak ada categoryId, set null
            },
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
}

export const getProducts = async (req, res) => {
    try {
        // Ambil semua produk
        const products = await prisma.product.findMany({
            include: {
                category: true, // Sertakan kategori
            }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        // Ambil produk berdasarkan ID
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl } = req.body;
    try {
        // Validasi input
        if (!name || !description || !price || !stock) {
            return res.status(400).json({ message: "Semua field wajib diisi." });
        }

        // Update produk
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                imageUrl,
            },
        });

        res.status(200).json({ message: "Produk berhasil diperbarui.", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Hapus produk
        await prisma.product.delete({
            where: { id },
        });

        res.status(200).json({ message: "Produk berhasil dihapus." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
}