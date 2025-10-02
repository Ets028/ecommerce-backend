// Common utility functions

export const handleAsyncError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const sendSuccessResponse = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (res, message = "Error occurred", statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

export const formatProductResponse = (product) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    userId: product.userId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: product.category,
  };
};

export const formatOrderResponse = (order) => {
  return {
    id: order.id,
    userId: order.userId,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paidAt: order.paidAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items,
  };
};

export const formatUserResponse = (user, includeSensitiveData = false) => {
  const response = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
  };

  if (includeSensitiveData) {
    response.password = user.password;
  }

  return response;
};