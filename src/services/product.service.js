import { prisma } from "../config/prisma.js";

export const findCategoryById = async (categoryId) => {
  return await prisma.category.findUnique({
    where: { id: categoryId },
  });
};

export const createProduct = async (productData, imageUrls = []) => {
  const { name, description, price, stock, categoryId, userId } = productData;
  
  return await prisma.$transaction(async (tx) => {
    // Create the product
    const product = await tx.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
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
};

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
      ProductImage: {
        orderBy: {
          isMain: 'desc' // Main image first
        }
      }
    }
  });
};

export const getProductById = async (id) => {
  return await prisma.product.findUnique({
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
};

export const updateProduct = async (id, productData) => {
  const { name, description, price, stock } = productData;
  
  return await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: parseFloat(price),
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
};

export const deleteProduct = async (id) => {
  return await prisma.$transaction(async (tx) => {
    // Delete product images first
    await tx.productImage.deleteMany({
      where: { productId: id },
    });

    // Then delete the product
    return await tx.product.delete({
      where: { id },
    });
  });
};

// Function to add images to an existing product
export const addProductImages = async (productId, imageUrls) => {
  return await prisma.$transaction(async (tx) => {
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
};

// Function to set a specific image as main
export const setMainImage = async (productId, imageId) => {
  return await prisma.$transaction(async (tx) => {
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
};

// Function to delete a product image
export const deleteProductImage = async (imageId) => {
  return await prisma.productImage.delete({
    where: { id: imageId },
  });
};