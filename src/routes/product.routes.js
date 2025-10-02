import express from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    createProductWithImages,
    addImagesToProduct,
    setMainProductImage,
    deleteProductImage,
    uploadMultipleImages
} from '../controllers/product.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/authorization.middleware.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Public routes - users can explore products
router.get('/', getProducts);
router.get('/:id', validateParams(['id']), getProductById);

// Admin routes - only admin can manage products
router.post('/', 
    authRequired, 
    isAdmin,
    validateBody(['name', 'description', 'price', 'stock']), 
    createProduct
);

// Create product with image upload capability
router.post('/create-with-images',
    authRequired,
    isAdmin,
    uploadMultipleImages,
    validateBody(['name', 'description', 'price', 'stock']),
    createProductWithImages
);

router.put('/:id', 
    authRequired,
    isAdmin,
    validateParams(['id']),
    validateBody(['name', 'description', 'price', 'stock']),
    updateProduct
);

router.delete('/:id', 
    authRequired,
    isAdmin,
    validateParams(['id']),
    deleteProduct
);

// Admin routes - only admin can manage product images
router.post('/:productId/images',
    authRequired,
    isAdmin,
    validateParams(['productId']),
    uploadMultipleImages,
    addImagesToProduct
);

router.put('/:productId/images/:imageId/set-main',
    authRequired,
    isAdmin,
    validateParams(['productId', 'imageId']),
    setMainProductImage
);

router.delete('/images/:imageId',
    authRequired,
    isAdmin,
    validateParams(['imageId']),
    deleteProductImage
);

export default router;
