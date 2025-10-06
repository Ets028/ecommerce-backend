import express from "express";

import { 
    getUserProfile, 
    updateUserAvatar,
    uploadAvatar 
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to get user profile
router.get("/profile", authRequired, getUserProfile);

// Route to update user avatar
router.put("/avatar", authRequired, uploadAvatar, updateUserAvatar);

export default router;