import { 
    findCategoryById, 
    createProduct as createProductService, 
    getAllProducts as getAllProductsService, 
    getProductById as getProductByIdService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
    addProductImages,
    setMainImage,
    deleteProductImage
} from "../services/product.service.js";
import { AppError } from "../utils/errorHandler.js";
import upload from "../config/multer.js";
import path from 'path';

// Middleware to handle single image upload
export const uploadSingleImage = upload.single('image');

// Middleware to handle multiple image uploads
export const uploadMultipleImages = upload.array('images', 10); // Allow up to 10 images

export const createProduct = async (req, res, next) => {
    // Only body data, not image files yet in this version
    const { name, description, price, stock, categoryId } = req.body;

    // Validasi input
    if (!name || !description || !price || !stock) {
        return next(new AppError("Semua field wajib diisi.", 400));
    }

    try {
        // Cek apakah kategori ada
        if (categoryId) {
            const category = await findCategoryById(categoryId);

            if (!category) {
                return next(new AppError("Kategori tidak ditemukan.", 404));
            }
        }

        // Prepare image URLs if images were uploaded
        let imageUrls = [];
        if (req.files) {
            imageUrls = req.files.map(file => `/images/products/${file.filename}`);
        } else if (req.file) {
            imageUrls = [`/images/products/${req.file.filename}`];
        }

        // Buat produk baru
        const product = await createProductService({
            name,
            description,
            price,
            stock,
            categoryId,
            userId: req.user.userId
        }, imageUrls);

        res.status(201).json({
            success: true,
            data: product,
            message: "Produk berhasil dibuat."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server.", 500));
    }
}

// Create product with images
export const createProductWithImages = async (req, res, next) => {
    const { name, description, price, stock, categoryId } = req.body;

    // Validasi input
    if (!name || !description || !price || !stock) {
        return next(new AppError("Semua field wajib diisi.", 400));
    }

    try {
        // Cek apakah kategori ada
        if (categoryId) {
            const category = await findCategoryById(categoryId);

            if (!category) {
                return next(new AppError("Kategori tidak ditemukan.", 404));
            }
        }

        // Prepare image URLs from uploaded files
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Convert file paths to full URLs
            imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/images/products/${file.filename}`);
        }

        // Buat produk baru dengan gambar
        const product = await createProductService({
            name,
            description,
            price,
            stock,
            categoryId,
            userId: req.user.userId
        }, imageUrls);

        res.status(201).json({
            success: true,
            data: product,
            message: "Produk berhasil dibuat dengan gambar."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server.", 500));
    }
}

export const getProducts = async (req, res, next) => {
    try {
        // Ambil semua produk
        const products = await getAllProductsService();

        res.status(200).json({
            success: true,
            data: products,
            message: "Produk berhasil diambil."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server.", 500));
    }
}

export const getProductById = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Ambil produk berdasarkan ID
        const product = await getProductByIdService(id);

        if (!product) {
            return next(new AppError("Produk tidak ditemukan.", 404));
        }

        res.status(200).json({
            success: true,
            data: product,
            message: "Produk berhasil diambil."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server.", 500));
    }
}

export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    try {
        // Validasi input
        if (!name || !description || !price || !stock) {
            return next(new AppError("Semua field wajib diisi.", 400));
        }

        // Update produk
        const product = await updateProductService(id, {
            name,
            description,
            price,
            stock
        });

        res.status(200).json({
            success: true,
            data: product,
            message: "Produk berhasil diperbarui."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server.", 500));
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Hapus produk
        await deleteProductService(id);

        res.status(200).json({
            success: true,
            data: null,
            message: "Produk berhasil dihapus."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server.", 500));
    }
}

// Add images to existing product
export const addImagesToProduct = async (req, res, next) => {
    const { productId } = req.params;

    try {
        // Prepare image URLs from uploaded files
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Convert file paths to full URLs
            imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/images/products/${file.filename}`);
        } else {
            return next(new AppError("Tidak ada gambar yang diupload.", 400));
        }

        const updatedProduct = await addProductImages(productId, imageUrls);

        res.status(200).json({
            success: true,
            data: updatedProduct,
            message: "Gambar berhasil ditambahkan ke produk."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server saat menambahkan gambar.", 500));
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
            message: "Gambar utama berhasil diatur."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server saat mengatur gambar utama.", 500));
    }
};

// Delete product image
export const deleteProductImage = async (req, res, next) => {
    const { imageId } = req.params;

    try {
        await deleteProductImage(imageId);

        res.status(200).json({
            success: true,
            data: null,
            message: "Gambar produk berhasil dihapus."
        });
    } catch (error) {
        console.error(error);
        next(new AppError("Terjadi kesalahan pada server saat menghapus gambar.", 500));
    }
};