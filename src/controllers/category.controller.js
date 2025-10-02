import { 
    getAllCategories as getAllCategoriesService,
    getRootCategories,
    getCategoryWithChildren,
    getAllCategoriesHierarchy,
    createCategory as createCategoryService,
    updateCategory,
    deleteCategory as deleteCategoryService,
    findCategoryById
} from "../services/category.service.js";
import { AppError } from "../utils/errorHandler.js";

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategoriesService();
        res.status(200).json({
            success: true,
            data: categories,
            message: "Kategori berhasil diambil."
        });
    } catch (err) {
        next(new AppError("Gagal mengambil kategori.", 500));
    }
};

// Get all categories in a hierarchical structure
export const getAllCategoriesWithHierarchy = async (req, res, next) => {
    try {
        const categories = await getAllCategoriesHierarchy();
        res.status(200).json({
            success: true,
            data: categories,
            message: "Kategori dengan hierarki berhasil diambil."
        });
    } catch (err) {
        next(new AppError("Gagal mengambil kategori dengan hierarki.", 500));
    }
};

// Get root categories (categories without parents)
export const getRootCategories = async (req, res, next) => {
    try {
        const categories = await getRootCategories();
        res.status(200).json({
            success: true,
            data: categories,
            message: "Kategori root berhasil diambil."
        });
    } catch (err) {
        next(new AppError("Gagal mengambil kategori root.", 500));
    }
};

// Get a specific category with its children
export const getCategoryById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const category = await getCategoryWithChildren(id);

        if (!category) {
            return next(new AppError("Kategori tidak ditemukan.", 404));
        }

        res.status(200).json({
            success: true,
            data: category,
            message: "Kategori berhasil diambil."
        });
    } catch (err) {
        next(new AppError("Gagal mengambil kategori.", 500));
    }
};

export const createCategory = async (req, res, next) => {
    const { name, parentId } = req.body;

    try {
        // If parentId is provided, check if the parent category exists
        if (parentId) {
            const parentCategory = await findCategoryById(parentId);
            if (!parentCategory) {
                return next(new AppError("Parent kategori tidak ditemukan.", 404));
            }
        }

        const category = await createCategoryService(name, parentId);

        res.status(201).json({
            success: true,
            data: category,
            message: "Kategori berhasil dibuat."
        });
    } catch (err) {
        next(new AppError("Gagal membuat kategori.", 500));
    }
};

export const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { name, parentId } = req.body;

    try {
        // If parentId is provided, check if the parent category exists
        if (parentId) {
            const parentCategory = await findCategoryById(parentId);
            if (!parentCategory) {
                return next(new AppError("Parent kategori tidak ditemukan.", 404));
            }
        }

        const category = await updateCategory(id, name, parentId);

        res.status(200).json({
            success: true,
            data: category,
            message: "Kategori berhasil diperbarui."
        });
    } catch (err) {
        if (err.message && err.message.includes('circular reference')) {
            return next(new AppError(err.message, 400));
        }
        next(new AppError("Gagal memperbarui kategori.", 500));
    }
};

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params;

    try {
        await deleteCategoryService(id);

        res.status(200).json({
            success: true,
            data: null,
            message: "Kategori berhasil dihapus."
        });
    } catch (err) {
        if (err.message && err.message.includes('Cannot delete category with children')) {
            return next(new AppError(err.message, 400));
        }
        next(new AppError("Gagal menghapus kategori.", 500));
    }
};
