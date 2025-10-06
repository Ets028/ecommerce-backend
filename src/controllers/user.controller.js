import { 
    findUserById, 
    updateUserAvatar as updateUserAvatarService,
    updateUserProfile as updateUserProfileService,
    getUserProfile as getUserProfileService
} from '../services/user.service.js';
import { AppError } from '../utils/errorHandler.js';
import upload from '../config/multer.js';

// Middleware to handle single avatar upload
export const uploadAvatar = upload.single('avatar');

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await getUserProfileService(req.user.userId);

        if (!user) {
            return next(new AppError('User not found.', 404));
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'User profile retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        next(new AppError('Server error occurred.', 500));
    }
}

// Update user avatar
export const updateUserAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('Avatar image is required.', 400));
        }

        // Get the Cloudinary URL from file.path
        const avatarUrl = req.file.path;

        // Update user's avatar in database
        const updatedUser = await updateUserAvatarService(req.user.userId, avatarUrl);

        res.status(200).json({
            success: true,
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatarUrl: updatedUser.avatarUrl,
                role: updatedUser.role,
            },
            message: 'User avatar updated successfully'
        });
    } catch (error) {
        console.error(error);
        next(new AppError('Server error occurred.', 500));
    }
}

// Update user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        // Zod validation has already been performed by middleware
        const profileData = req.validatedData;

        const updatedUser = await updateUserProfileService(req.user.userId, profileData);

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'User profile updated successfully'
        });
    } catch (error) {
        console.error(error);
        next(new AppError('Server error occurred.', 500));
    }
}

// Get user profile with completion status
export const getUserProfileWithCompletion = async (req, res, next) => {
    try {
        const user = await getUserProfileService(req.user.userId);

        if (!user) {
            return next(new AppError('User not found.', 404));
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'User profile retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        next(new AppError('Server error occurred.', 500));
    }
}