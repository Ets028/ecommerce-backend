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

const router = express.Router();

// Route to get all products
router.get('/', getProducts);
router.get('/:id', getProductById);

// Create product with image upload capability
router.post('/', authRequired, createProduct);
router.post('/create-with-images', authRequired, uploadMultipleImages, createProductWithImages);

// Update and delete products
router.put('/:id', authRequired, updateProduct);
router.delete('/:id', authRequired, deleteProduct);

// Product image routes
router.post('/:productId/images', authRequired, uploadMultipleImages, addImagesToProduct);
router.put('/:productId/images/:imageId/set-main', authRequired, setMainProductImage);
router.delete('/images/:imageId', authRequired, deleteProductImage);

export default router;
