import express from "express";
import { getAllCategories, createCategory } from "../controllers/category.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authRequired, isAdmin, createCategory);

export default router;
