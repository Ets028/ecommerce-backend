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
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/hierarchy", getAllCategoriesWithHierarchy);
router.get("/root", getRootCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", authRequired, isAdmin, createCategory);
router.put("/:id", authRequired, isAdmin, updateCategory);
router.delete("/:id", authRequired, isAdmin, deleteCategory);

export default router;
