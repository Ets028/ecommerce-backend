import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  email: z.string().email('Invalid email format').optional(),
});

export const updateUserProfileSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').max(255).optional(),
  city: z.string().min(2, 'City name is required').max(100).optional(),
  province: z.string().min(2, 'Province is required').max(100).optional(),
  postalCode: z.string().regex(/^\d{5}$/, 'Postal code must be 5 digits').optional(),
  country: z.string().min(2, 'Country name is required').max(50).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserAvatarSchema = z.object({
  avatar: z.string().url('Invalid avatar URL').optional(),
});

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be a positive number'),
  salePrice: z.number().positive('Sale price must be a positive number').optional().nullable(),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  categoryId: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  salePrice: z.number().positive('Sale price must be a positive number').optional().nullable(),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
});

export const productIdSchema = z.object({
  id: z.string().cuid('Invalid product ID format'),
});

export const productParamsSchema = z.object({
  productId: z.string().cuid('Invalid product ID format'),
});

export const imageParamsSchema = z.object({
  productId: z.string().cuid('Invalid product ID format'),
  imageId: z.string().cuid('Invalid image ID format'),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  parentId: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  parentId: z.string().optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().cuid('Invalid category ID format'),
});

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().cuid('Invalid product ID format'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const updateCartSchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const cartParamsSchema = z.object({
  productId: z.string().cuid('Invalid product ID format'),
});

// Order validation schemas
export const createOrderSchema = z.object({
  // For creating order from cart, no specific fields needed
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid order status' })
  }),
});

export const orderIdSchema = z.object({
  id: z.string().cuid('Invalid order ID format'),
});

// Image validation schemas
export const imageIdSchema = z.object({
  imageId: z.string().cuid('Invalid image ID format'),
});

// Search and filter validation schemas
export const productSearchSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).refine(val => val >= 1, {
    message: "Page must be greater than or equal to 1"
  }).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(val => val >= 1 && val <= 100, {
    message: "Limit must be between 1 and 100"
  }).optional().default('10'),
  search: z.string().optional().default(''),
  category: z.string().cuid('Invalid category ID format').optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional().default('0'),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional().default('Infinity'),
  sortBy: z.enum(['name', 'price', 'createdAt', 'updatedAt', 'stock']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  saleOnly: z.enum(['true', 'false']).optional().default('false'),
});

// Validation helper function
export const validateWithSchema = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join(', ');
      throw new Error(`Validation error: ${errorMessages}`);
    }
    throw error;
  }
};