import { 
    getAllCategories as getAllCategoriesService,
    getRootCategories as getRootCategoriesService,
    getCategoryWithChildren,
    getAllCategoriesHierarchy,
    createCategory as createCategoryService,
    updateCategory as updateCategoryService,
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
            message: "Categories retrieved successfully."
        });
    } catch (err) {
        next(new AppError("Failed to retrieve categories.", 500));
    }
};

// Get all categories in a hierarchical structure
export const getAllCategoriesWithHierarchy = async (req, res, next) => {
    try {
        const categories = await getAllCategoriesHierarchy();
        res.status(200).json({
            success: true,
            data: categories,
            message: "Categories with hierarchy retrieved successfully."
        });
    } catch (err) {
        next(new AppError("Failed to retrieve categories with hierarchy.", 500));
    }
};

// Get root categories (categories without parents)
export const getRootCategories = async (req, res, next) => {
    try {
        const categories = await getRootCategoriesService();
        res.status(200).json({
            success: true,
            data: categories,
            message: "Root categories retrieved successfully."
        });
    } catch (err) {
        next(new AppError("Failed to retrieve root categories.", 500));
    }
};

// Get a specific category with its children
export const getCategoryById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const category = await getCategoryWithChildren(id);

        if (!category) {
            return next(new AppError("Category not found.", 404));
        }

        res.status(200).json({
            success: true,
            data: category,
            message: "Category retrieved successfully."
        });
    } catch (err) {
        next(new AppError("Failed to retrieve category.", 500));
    }
};

export const createCategory = async (req, res, next) => {
    const { name, parentId } = req.body;

    try {
        // If parentId is provided, check if the parent category exists
        if (parentId) {
            const parentCategory = await findCategoryById(parentId);
            if (!parentCategory) {
                return next(new AppError("Parent category not found.", 404));
            }
        }

        const category = await createCategoryService(name, parentId);

        res.status(201).json({
            success: true,
            data: category,
            message: "Category created successfully."
        });
    } catch (err) {
        next(new AppError("Failed to create category.", 500));
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
                return next(new AppError("Parent category not found.", 404));
            }
        }

        const category = await updateCategoryService(id, name, parentId);

        res.status(200).json({
            success: true,
            data: category,
            message: "Category updated successfully."
        });
    } catch (err) {
        if (err.message && err.message.includes('circular reference')) {
            return next(new AppError(err.message, 400));
        }
        next(new AppError("Failed to update category.", 500));
    }
};

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params;

    try {
        await deleteCategoryService(id);

        res.status(200).json({
            success: true,
            data: null,
            message: "Category deleted successfully."
        });
    } catch (err) {
        if (err.message && err.message.includes('Cannot delete category with children')) {
            return next(new AppError(err.message, 400));
        }
        next(new AppError("Failed to delete category.", 500));
    }
};
