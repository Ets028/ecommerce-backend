import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route to get all products
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authRequired, createProduct);
router.put('/:id', authRequired, updateProduct);
router.delete('/:id', authRequired, deleteProduct);

export default router;
