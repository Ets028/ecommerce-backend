import { 
    findCategoryById, 
    createProduct as createProductService, 
    getAllProducts as getAllProductsService, 
    getProductById as getProductByIdService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
    addProductImages,
    setMainImage,
    deleteProductImage as deleteProductImageService,
    getProductsByCategory as getProductsByCategoryService
} from "../services/product.service.js";
import { AppError } from "../utils/errorHandler.js";
import upload from "../config/multer.js";
import path from 'path';

// Middleware to handle single image upload
export const uploadSingleImage = upload.single('image');

// Middleware to handle multiple image uploads
export const uploadMultipleImages = upload.array('images', 10); // Allow up to 10 images

export const createProduct = async (req, res, next) => {
    try {
        // Zod validation has already been performed by middleware
        const { name, description, price, salePrice, stock, categoryId } = req.validatedData;

        // Check if category exists
        if (categoryId) {
            const category = await findCategoryById(categoryId);

            if (!category) {
                return next(new AppError("Category not found.", 404));
            }
        }

        // Prepare image URLs if images were uploaded
        let imageUrls = [];
        if (req.files) {
            imageUrls = req.files.map(file => file.path); // Cloudinary returns the URL in file.path
        } else if (req.file) {
            imageUrls = [req.file.path]; // Cloudinary returns the URL in file.path
        }

        // Create new product
        const product = await createProductService({
            name,
            description,
            price,
            salePrice,
            stock,
            categoryId,
            userId: req.user.userId
        }, imageUrls);

        res.status(201).json({
            success: true,
            data: product,
            message: "Product created successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred.", 500));
    }
}

// Create product with images
export const createProductWithImages = async (req, res, next) => {
    try {
        // Zod validation has already been performed by middleware
        const { name, description, price, salePrice, stock, categoryId } = req.validatedData;

        // Check if category exists
        if (categoryId) {
            const category = await findCategoryById(categoryId);

            if (!category) {
                return next(new AppError("Category not found.", 404));
            }
        }

        // Prepare image URLs from uploaded files
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Cloudinary returns the URL in file.path
            imageUrls = req.files.map(file => file.path);
        }

        // Create new product with images
        const product = await createProductService({
            name,
            description,
            price,
            salePrice,
            stock,
            categoryId,
            userId: req.user.userId
        }, imageUrls);

        res.status(201).json({
            success: true,
            data: product,
            message: "Product created with images successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred.", 500));
    }
}

export const getProducts = async (req, res, next) => {
    try {
        // Extract query parameters for search, filter, and pagination
        const {
            page = '1',
            limit = '10',
            search = '',
            category = '',
            minPrice = '0',
            maxPrice = '',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            saleOnly = 'false'
        } = req.query;

        // Validate and sanitize input
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 items per page
        const minPriceNum = Math.max(0, parseFloat(minPrice) || 0);
        let maxPriceNum = Infinity;
        if (maxPrice && maxPrice !== 'Infinity' && maxPrice !== 'infinity') {
            maxPriceNum = parseFloat(maxPrice) || Infinity;
        }
        
        const validSortFields = ['name', 'price', 'createdAt', 'updatedAt', 'stock'];
        const validSortOrder = ['asc', 'desc'];
        const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const actualSortOrder = validSortOrder.includes(sortOrder) ? sortOrder : 'desc';
        const actualSaleOnly = saleOnly === 'true';

        // Get filtered and paginated products
        const result = await getAllProductsService({
            page: pageNum,
            limit: limitNum,
            search,
            category,
            minPrice: minPriceNum,
            maxPrice: maxPriceNum,
            sortBy: actualSortBy,
            sortOrder: actualSortOrder,
            saleOnly: actualSaleOnly
        });

        res.status(200).json({
            success: true,
            data: result,
            message: "Products retrieved successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred.", 500));
    }
}

export const getProductById = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Get product by ID
        const product = await getProductByIdService(id);

        if (!product) {
            return next(new AppError("Product not found.", 404));
        }

        res.status(200).json({
            success: true,
            data: product,
            message: "Product retrieved successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred.", 500));
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        // Zod validation has already been performed by middleware
        const { id } = req.params;
        const { name, description, price, salePrice, stock } = req.validatedData;

        // Update product
        const product = await updateProductService(id, {
            name,
            description,
            price,
            salePrice,
            stock
        });

        res.status(200).json({
            success: true,
            data: product,
            message: "Product updated successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred.", 500));
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Delete product
        await deleteProductService(id);

        res.status(200).json({
            success: true,
            data: null,
            message: "Product deleted successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred.", 500));
    }
}

// Add images to existing product
export const addImagesToProduct = async (req, res, next) => {
    const { productId } = req.params;

    try {
        // Prepare image URLs from uploaded files
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Cloudinary returns the URL in file.path
            imageUrls = req.files.map(file => file.path);
        } else {
            return next(new AppError("No images uploaded.", 400));
        }

        const updatedProduct = await addProductImages(productId, imageUrls);

        res.status(200).json({
            success: true,
            data: updatedProduct,
            message: "Images added to product successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred while adding images.", 500));
    }
};

// Set main image for product
export const setMainProductImage = async (req, res, next) => {
    const { productId, imageId } = req.params;

    try {
        const updatedImage = await setMainImage(productId, imageId);

        res.status(200).json({
            success: true,
            data: updatedImage,
            message: "Main image set successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred while setting main image.", 500));
    }
};

// Get products by category with search, filter, and pagination
export const getProductsByCategory = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Extract query parameters for search, filter, and pagination
    const {
      page = '1',
      limit = '10',
      search = '',
      minPrice = '0',
      maxPrice = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      saleOnly = 'false'
    } = req.query;

    // Validate and sanitize input
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 items per page
    const minPriceNum = Math.max(0, parseFloat(minPrice) || 0);
    let maxPriceNum = Infinity;
    if (maxPrice && maxPrice !== 'Infinity' && maxPrice !== 'infinity') {
        maxPriceNum = parseFloat(maxPrice) || Infinity;
    }
    
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt', 'stock'];
    const validSortOrder = ['asc', 'desc'];
    const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const actualSortOrder = validSortOrder.includes(sortOrder) ? sortOrder : 'desc';
    const actualSaleOnly = saleOnly === 'true';

    // Get filtered and paginated products by category
    const result = await getProductsByCategoryService(id, {
      page: pageNum,
      limit: limitNum,
      search,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      sortBy: actualSortBy,
      sortOrder: actualSortOrder,
      saleOnly: actualSaleOnly
    });

    res.status(200).json({
      success: true,
      data: result,
      message: "Products retrieved successfully."
    });
  } catch (error) {
    console.error(error);
    next(new AppError("Server error occurred.", 500));
  }
};

// Delete product image
export const deleteProductImage = async (req, res, next) => {
    const { imageId } = req.params;

    try {
        await deleteProductImageService(imageId);

        res.status(200).json({
            success: true,
            data: null,
            message: "Product image deleted successfully."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Server error occurred while deleting image.", 500));
    }
};