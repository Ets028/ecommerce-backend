import { prisma } from "../config/prisma.js";
import logger from '../config/logger.js';

export const findUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProfile: true
      }
    });
    
    if (user) {
      logger.info(`User found by ID`, {
        userId,
        userEmail: user.email,
        timestamp: new Date().toISOString()
      });
    } else {
      logger.warn(`User not found by ID`, {
        userId,
        timestamp: new Date().toISOString()
      });
    }
    
    // Format the user data for consistency with previous response structure
    return user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      profileCompleted: user.userProfile?.profileCompleted || false,
      phone: user.userProfile?.phone || null,
      address: user.userProfile?.address || null,
      city: user.userProfile?.city || null,
      province: user.userProfile?.province || null,
      postalCode: user.userProfile?.postalCode || null,
      country: user.userProfile?.country || 'Indonesia'
    } : null;
  } catch (error) {
    logger.error(`Error finding user by ID: ${error.message}`, {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
    
    logger.info(`User avatar updated`, {
      userId,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error updating user avatar: ${error.message}`, {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    // Check if all required profile fields are provided to mark profile as completed
    const hasRequiredFields = profileData.phone && profileData.address && profileData.city && profileData.province && profileData.postalCode;
    const profileCompleted = hasRequiredFields;

    // Upsert the user profile (create if doesn't exist, update if exists)
    const userProfile = await prisma.userProfile.upsert({
      where: { 
        userId: userId 
      },
      update: {
        ...profileData,
        profileCompleted,
      },
      create: {
        userId: userId,
        ...profileData,
        profileCompleted,
      }
    });

    // Get the full user with profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userProfile: true }
    });

    logger.info(`User profile updated`, {
      userId,
      profileCompleted,
      timestamp: new Date().toISOString()
    });
    
    // Format the user data for consistency
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      profileCompleted: userProfile.profileCompleted,
      phone: userProfile.phone,
      address: userProfile.address,
      city: userProfile.city,
      province: userProfile.province,
      postalCode: userProfile.postalCode,
      country: userProfile.country
    };
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`, {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userProfile: true }
    });
    
    if (user) {
      logger.info(`User profile retrieved`, {
        userId,
        timestamp: new Date().toISOString()
      });
    }
    
    // Format the user data for consistency
    return user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      profileCompleted: user.userProfile?.profileCompleted || false,
      phone: user.userProfile?.phone || null,
      address: user.userProfile?.address || null,
      city: user.userProfile?.city || null,
      province: user.userProfile?.province || null,
      postalCode: user.userProfile?.postalCode || null,
      country: user.userProfile?.country || 'Indonesia'
    } : null;
  } catch (error) {
    logger.error(`Error retrieving user profile: ${error.message}`, {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const createUserProfile = async (userId, profileData) => {
  try {
    // Check if all required profile fields are provided to mark profile as completed
    const hasRequiredFields = profileData.phone && profileData.address && profileData.city && profileData.province && profileData.postalCode;
    const profileCompleted = hasRequiredFields;

    const userProfile = await prisma.userProfile.create({
      data: {
        userId,
        ...profileData,
        profileCompleted,
      }
    });
    
    logger.info(`User profile created`, {
      userId,
      profileCompleted,
      timestamp: new Date().toISOString()
    });
    
    return userProfile;
  } catch (error) {
    logger.error(`Error creating user profile: ${error.message}`, {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const getUserProfileWithUserDetails = async (userId) => {
  try {
    const result = await prisma.userProfile.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          }
        }
      }
    });
    
    logger.info(`User profile with details retrieved`, {
      userId,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error retrieving user profile with details: ${error.message}`, {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};