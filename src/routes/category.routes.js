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
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/hierarchy", getAllCategoriesWithHierarchy);
router.get("/root", getRootCategories);
router.get("/:id", validateParams(['id']), getCategoryById);

// Admin routes
router.post("/", 
    authRequired, 
    isAdmin, 
    validateBody(['name']), 
    createCategory
);

router.put("/:id", 
    authRequired, 
    isAdmin, 
    validateParams(['id']), 
    validateBody(['name']), 
    updateCategory
);

router.delete("/:id", 
    authRequired, 
    isAdmin, 
    validateParams(['id']), 
    deleteCategory
);

export default router;
