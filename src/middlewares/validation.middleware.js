import { 
  createUserSchema,
  updateUserSchema,
  updateUserProfileSchema,
  loginUserSchema,
  updateUserAvatarSchema,
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
  imageParamsSchema,
  imageIdSchema,
  productSearchSchema,
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  addToCartSchema,
  updateCartSchema,
  cartParamsSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
  validateWithSchema 
} from '../utils/validation.util.js';

// Generic validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate body, params, and query separately
      const validatedData = validateWithSchema(schema, {
        ...req.body,
        ...req.params,
        ...req.query,
      });

      // If validation passes, add the validated data to req object
      req.validatedData = validatedData;
      
      // Don't modify the original request objects to avoid the getter/setter error
      // Instead, just store the validated data in req.validatedData

      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };
};

// Specific validation middleware for different operations
export const validateCreateUser = validate(createUserSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateUpdateUserProfile = validate(updateUserProfileSchema);
export const validateLoginUser = validate(loginUserSchema);
export const validateProductSearch = validate(productSearchSchema);
export const validateCreateProduct = validate(createProductSchema);
export const validateUpdateProduct = validate(updateProductSchema);
export const validateProductParams = validate(productParamsSchema);
export const validateImageParams = validate(imageParamsSchema);
export const validateImageId = validate(imageIdSchema);
export const validateCreateCategory = validate(createCategorySchema);
export const validateUpdateCategory = validate(updateCategorySchema);
export const validateCategoryId = validate(categoryIdSchema);
export const validateAddToCart = validate(addToCartSchema);
export const validateUpdateCart = validate(updateCartSchema);
export const validateCartParams = validate(cartParamsSchema);
export const validateCreateOrder = validate(createOrderSchema);
export const validateUpdateOrderStatus = validate(updateOrderStatusSchema);
export const validateOrderId = validate(orderIdSchema);

// Backward compatibility functions for old validation approach
export const validateBody = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
          data: null
        });
      }
    }
    next();
  };
};

export const validateParams = (params) => {
  return (req, res, next) => {
    for (const param of params) {
      if (!req.params[param]) {
        return res.status(400).json({
          success: false,
          message: `${param} is required in URL parameters.`,
          data: null
        });
      }
    }
    next();
  };
};