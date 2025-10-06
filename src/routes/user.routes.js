import express from "express";

import { 
    getUserProfile, 
    updateUserAvatar,
    updateUserProfile,
    getUserProfileWithCompletion,
    uploadAvatar 
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { validateUpdateUserProfile } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Route to get user profile
router.get("/profile", authRequired, getUserProfile);

// Route to update user avatar
router.put("/avatar", authRequired, uploadAvatar, updateUserAvatar);

// Route to update user profile
router.put("/profile", authRequired, validateUpdateUserProfile, updateUserProfile);

export default router;