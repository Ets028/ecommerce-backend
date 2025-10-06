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