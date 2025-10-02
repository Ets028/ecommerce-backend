import { prisma } from "../config/prisma.js";

export const getCartItemsByUserId = async (userId) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });
};

export const createOrder = async (userId, total, cartItems) => {
  return await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        }))
      }
    },
    include: {
      items: true
    }
  });
};

export const updateProductStock = async (productId, quantity) => {
  return await prisma.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } }
  });
};

export const deleteCartItemsByUserId = async (userId) => {
  return await prisma.cartItem.deleteMany({
    where: { userId }
  });
};

export const getUserOrders = async (userId) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getOrderById = async (orderId) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
};

export const updateOrderStatus = async (orderId, status) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });
};

export const deleteOrder = async (orderId) => {
  return await prisma.order.delete({
    where: { id: orderId },
  });
};