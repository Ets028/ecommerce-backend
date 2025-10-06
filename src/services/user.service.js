import { prisma } from "../config/prisma.js";
import logger from '../config/logger.js';

export const findUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        profileCompleted: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        country: true,
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
    
    return user;
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

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        ...profileData,
        profileCompleted,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        profileCompleted: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        country: true,
      }
    });
    
    logger.info(`User profile updated`, {
      userId,
      profileCompleted,
      timestamp: new Date().toISOString()
    });
    
    return result;
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
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        profileCompleted: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        country: true,
      }
    });
    
    if (user) {
      logger.info(`User profile retrieved`, {
        userId,
        timestamp: new Date().toISOString()
      });
    }
    
    return user;
  } catch (error) {
    logger.error(`Error retrieving user profile: ${error.message}`, {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};