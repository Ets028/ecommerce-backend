import { prisma } from "../config/prisma.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil kategori." });
    }
};

export const createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const category = await prisma.category.create({
            data: { name },
        });

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: "Gagal membuat kategori." });
    }
};
