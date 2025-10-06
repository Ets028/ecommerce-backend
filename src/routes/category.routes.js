import express from "express";
import { 
    getAllCategories, 
    getAllCategoriesWithHierarchy,
    getRootCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory 
} from "../controllers/category.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { validateCreateCategory, validateUpdateCategory, validateCategoryId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/hierarchy", getAllCategoriesWithHierarchy);
router.get("/root", getRootCategories);
router.get("/:id", validateCategoryId, getCategoryById);

// Admin routes
router.post("/", 
    authRequired, 
    isAdmin, 
    validateCreateCategory, 
    createCategory
);

router.put("/:id", 
    authRequired, 
    isAdmin, 
    validateCategoryId, 
    validateUpdateCategory, 
    updateCategory
);

router.delete("/:id", 
    authRequired, 
    isAdmin, 
    validateCategoryId, 
    deleteCategory
);

export default router;
