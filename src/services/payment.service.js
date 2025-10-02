import { prisma } from "../config/prisma.js";

export const getOrderById = async (orderId) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
  });
};

export const updateOrderPaymentStatus = async (orderId, paymentStatus, status, paidAt) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus,
      status,
      paidAt,
    },
  });
};