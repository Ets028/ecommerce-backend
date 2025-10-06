import { prisma } from "../config/prisma.js";
import logger from '../config/logger.js';

export const findCategoryById = async (categoryId) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    
    if (category) {
      logger.info(`Category found: ${category.name}`, {
        categoryId,
        timestamp: new Date().toISOString()
      });
    } else {
      logger.warn(`Category not found`, {
        categoryId,
        timestamp: new Date().toISOString()
      });
    }
    
    return category;
  } catch (error) {
    logger.error(`Error finding category by ID: ${error.message}`, {
      categoryId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const createProduct = async (productData, imageUrls = []) => {
  const { name, description, price, salePrice, stock, categoryId, userId } = productData;
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create the product
      const product = await tx.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          stock: parseInt(stock, 10),
          userId,
          categoryId: categoryId || null,
          // Set the first image as the main image URL if provided
          imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
        },
      });

      // Create product images if provided
      if (imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          await tx.productImage.create({
            data: {
              productId: product.id,
              imageUrl: imageUrls[i],
              isMain: i === 0, // First image is the main image
            },
          });
        }
      }

      // Return the product with its images
      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          ProductImage: true,
          category: true,
        },
      });
    });
    
    logger.info(`Product created successfully`, {
      productId: result.id,
      productName: result.name,
      userId,
      imageCount: imageUrls.length,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`, {
      userId,
      productName: name,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const getAllProducts = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    category = '',
    minPrice = 0,
    maxPrice = Infinity,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    saleOnly = false
  } = options;

  try {
    const skip = (page - 1) * limit;
    const whereClause = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        category ? { categoryId: category } : {},
        {
          AND: [
            { price: { gte: parseFloat(minPrice) || 0 } },
            { price: { lte: parseFloat(maxPrice) || Infinity } }
          ]
        },
        saleOnly ? { salePrice: { not: null } } : {}
      ]
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          ProductImage: {
            orderBy: {
              isMain: 'desc' // Main image first
            }
          }
        },
        take: parseInt(limit),
        skip: skip,
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.product.count({ where: whereClause })
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    logger.info(`Retrieved ${products.length} products from ${totalCount} total`, {
      page,
      limit,
      search,
      category,
      minPrice,
      maxPrice,
      saleOnly,
      timestamp: new Date().toISOString()
    });
    
    return {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    logger.error(`Error retrieving products: ${error.message}`, {
      page,
      limit,
      search,
      category,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        ProductImage: {
          orderBy: {
            isMain: 'desc' // Main image first
          }
        }
      }
    });
    
    if (product) {
      logger.info(`Product retrieved by ID`, {
        productId: id,
        productName: product.name,
        timestamp: new Date().toISOString()
      });
    } else {
      logger.warn(`Product not found by ID`, {
        productId: id,
        timestamp: new Date().toISOString()
      });
    }
    
    return product;
  } catch (error) {
    logger.error(`Error retrieving product by ID: ${error.message}`, {
      productId: id,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Get products by category with pagination and filtering
export const getProductsByCategory = async (categoryId, options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    minPrice = 0,
    maxPrice = Infinity,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    saleOnly = false
  } = options;

  try {
    const skip = (page - 1) * limit;
    const whereClause = {
      AND: [
        { categoryId },
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        {
          AND: [
            { price: { gte: parseFloat(minPrice) || 0 } },
            { price: { lte: parseFloat(maxPrice) || Infinity } }
          ]
        },
        saleOnly ? { salePrice: { not: null } } : {}
      ]
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          ProductImage: {
            orderBy: {
              isMain: 'desc' // Main image first
            }
          }
        },
        take: parseInt(limit),
        skip: skip,
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.product.count({ where: whereClause })
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    logger.info(`Retrieved ${products.length} products from category ${categoryId}`, {
      page,
      limit,
      search,
      categoryId,
      timestamp: new Date().toISOString()
    });
    
    return {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    logger.error(`Error retrieving products by category: ${error.message}`, {
      categoryId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  const { name, description, price, salePrice, stock } = productData;
  
  try {
    const result = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        salePrice: salePrice !== undefined ? parseFloat(salePrice) : undefined,
        stock: parseInt(stock, 10),
      },
      include: {
        category: true,
        ProductImage: {
          orderBy: {
            isMain: 'desc' // Main image first
          }
        }
      }
    });
    
    logger.info(`Product updated successfully`, {
      productId: id,
      productName: result.name,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error updating product: ${error.message}`, {
      productId: id,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Delete product images first
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      // Then delete the product
      return await tx.product.delete({
        where: { id },
      });
    });
    
    logger.info(`Product deleted successfully`, {
      productId: id,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error deleting product: ${error.message}`, {
      productId: id,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Function to add images to an existing product
export const addProductImages = async (productId, imageUrls) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Add images to the product
      for (let i = 0; i < imageUrls.length; i++) {
        await tx.productImage.create({
          data: {
            productId,
            imageUrl: imageUrls[i],
            isMain: false, // By default, new images are not main
          },
        });
      }

      // Return the updated product with all images
      return await tx.product.findUnique({
        where: { id: productId },
        include: {
          ProductImage: {
            orderBy: {
              isMain: 'desc'
            }
          }
        }
      });
    });
    
    logger.info(`Images added to product`, {
      productId,
      imageCount: imageUrls.length,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error adding images to product: ${error.message}`, {
      productId,
      imageCount: imageUrls.length,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Function to set a specific image as main
export const setMainImage = async (productId, imageId) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // First, set all images for this product as not main
      await tx.productImage.updateMany({
        where: { productId },
        data: { isMain: false },
      });

      // Then, set the specified image as main
      const updatedImage = await tx.productImage.update({
        where: { id: imageId },
        data: { isMain: true },
      });

      // Update the product's main imageUrl field
      await tx.product.update({
        where: { id: productId },
        data: { imageUrl: updatedImage.imageUrl },
      });

      return updatedImage;
    });
    
    logger.info(`Main image set for product`, {
      productId,
      imageId,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error setting main image for product: ${error.message}`, {
      productId,
      imageId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Function to delete a product image
export const deleteProductImage = async (imageId) => {
  try {
    const result = await prisma.productImage.delete({
      where: { id: imageId },
    });
    
    logger.info(`Product image deleted`, {
      imageId,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error(`Error deleting product image: ${error.message}`, {
      imageId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};