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
import { 
    validateCreateProduct, 
    validateUpdateProduct, 
    validateProductId, 
    validateProductParams, 
    validateImageParams, 
    validateImageId 
} from '../middlewares/validation.middleware.js';

const router = express.Router();

// Public routes - users can explore products
router.get('/', getProducts);
router.get('/:id', validateProductId, getProductById);

// Admin routes - only admin can manage products
router.post('/', 
    authRequired, 
    isAdmin,
    validateCreateProduct, 
    createProduct
);

// Create product with image upload capability
router.post('/create-with-images',
    authRequired,
    isAdmin,
    uploadMultipleImages,
    validateCreateProduct,
    createProductWithImages
);

router.put('/:id', 
    authRequired,
    isAdmin,
    validateProductId,
    validateUpdateProduct,
    updateProduct
);

router.delete('/:id', 
    authRequired,
    isAdmin,
    validateProductId,
    deleteProduct
);

// Admin routes - only admin can manage product images
router.post('/:productId/images',
    authRequired,
    isAdmin,
    validateProductParams,
    uploadMultipleImages,
    addImagesToProduct
);

router.put('/:productId/images/:imageId/set-main',
    authRequired,
    isAdmin,
    validateImageParams,
    setMainProductImage
);

router.delete('/images/:imageId',
    authRequired,
    isAdmin,
    validateImageId,
    deleteProductImage
);

export default router;
