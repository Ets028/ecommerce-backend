import { AppError } from '../utils/errorHandler.js';
import { validateRequiredFields } from '../utils/validation.util.js';

// Middleware to validate required fields in request body
export const validateBody = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = validateRequiredFields(req.body, requiredFields);
        
        if (missingFields.length > 0) {
            return next(new AppError(`Required fields "${missingFields.join(', ')}" cannot be empty.`, 400));
        }
        
        next();
    };
};

// Middleware to validate request parameters
export const validateParams = (requiredParams) => {
    return (req, res, next) => {
        const missingParams = [];
        
        for (const param of requiredParams) {
            if (!req.params[param]) {
                missingParams.push(param);
            }
        }
        
        if (missingParams.length > 0) {
            return next(new AppError(`Required parameters "${missingParams.join(', ')}" cannot be empty.`, 400));
        }
        
        next();
    };
};

// Middleware to validate query parameters
export const validateQuery = (requiredQuery) => {
    return (req, res, next) => {
        const missingQuery = [];
        
        for (const query of requiredQuery) {
            if (!req.query[query]) {
                missingQuery.push(query);
            }
        }
        
        if (missingQuery.length > 0) {
            return next(new AppError(`Required query parameters "${missingQuery.join(', ')}" cannot be empty.`, 400));
        }
        
        next();
    };
};

// Middleware to validate if the product exists before processing
export const validateProductExists = async (req, res, next) => {
    const { id } = req.params;
    
    if (!id) {
        return next(new AppError('Product ID not found.', 400));
    }
    
    try {
        const { getProductById } = await import('../services/product.service.js');
        const product = await getProductById(id);
        
        if (!product) {
            return next(new AppError('Product not found.', 404));
        }
        
        req.product = product;
        next();
    } catch (error) {
        console.error(error);
        next(new AppError('Server error occurred during product validation.', 500));
    }
};

// Middleware to validate if the category exists before processing
export const validateCategoryExists = async (req, res, next) => {
    const { id } = req.params;
    
    if (!id) {
        return next(new AppError('Category ID not found.', 400));
    }
    
    try {
        const { findCategoryById } = await import('../services/category.service.js');
        const category = await findCategoryById(id);
        
        if (!category) {
            return next(new AppError('Category not found.', 404));
        }
        
        req.category = category;
        next();
    } catch (error) {
        console.error(error);
        next(new AppError('Server error occurred during category validation.', 500));
    }
};