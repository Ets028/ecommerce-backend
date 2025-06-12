import express from "express";

import { getUserProfile } from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to get user profile
router.get("/profile", authRequired, getUserProfile);

export default router;