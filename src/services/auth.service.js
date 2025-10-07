import { prisma } from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import logger from '../config/logger.js';

export const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      logger.info(`User found by email`, {
        userEmail: email,
        userId: user.id,
        timestamp: new Date().toISOString()
      });
    } else {
      logger.warn(`User not found by email`, {
        email,
        timestamp: new Date().toISOString()
      });
    }
    
    return user;
  } catch (error) {
    logger.error(`Error finding user by email: ${error.message}`, {
      email,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const createUser = async (userData) => {
  const { name, email, password, role = "user" } = userData;
  
  try {
    const hashedPassword = await hashPassword(password);
    
    // Create user and associated profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      
      // Create an empty profile for the user
      await tx.userProfile.create({
        data: {
          userId: newUser.id,
          profileCompleted: false // Profile is not completed initially
        }
      });
      
      return newUser;
    });
    
    logger.info(`User created successfully with profile`, {
      userId: user.id,
      userEmail: user.email,
      timestamp: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`, {
      email,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const validatePassword = async (password, hashedPassword) => {
  try {
    const isValid = await comparePassword(password, hashedPassword);
    
    logger.info(`Password validation completed`, {
      isValid,
      timestamp: new Date().toISOString()
    });
    
    return isValid;
  } catch (error) {
    logger.error(`Error validating password: ${error.message}`, {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};