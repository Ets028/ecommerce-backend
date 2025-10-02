import { prisma } from "../config/prisma.js";

export const findCartItemByUserAndProduct = async (userId, productId) => {
  return await prisma.cartItem.findUnique({
    where: {
      user_product_unique: { userId, productId }
    }
  });
};

export const createCartItem = async (userId, productId, quantity) => {
  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity
    }
  });
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
  return await prisma.cartItem.update({
    where: {
      user_product_unique: { userId, productId }
    },
    data: {
      quantity
    }
  });
};

export const incrementCartItemQuantity = async (userId, productId, quantity) => {
  return await prisma.cartItem.update({
    where: {
      user_product_unique: { userId, productId }
    },
    data: {
      quantity: {
        increment: quantity
      }
    }
  });
};

export const getUserCartItems = async (userId) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true
    }
  });
};

export const updateCartItem = async (userId, productId, quantity) => {
  return await prisma.cartItem.update({
    where: {
      user_product_unique: {
        userId,
        productId
      }
    },
    data: { quantity }
  });
};

export const deleteCartItem = async (userId, productId) => {
  return await prisma.cartItem.delete({
    where: {
      user_product_unique: {
        userId,
        productId
      }
    }
  });
};