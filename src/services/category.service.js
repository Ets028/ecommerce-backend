import { prisma } from "../config/prisma.js";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      parent: true,
      children: true,
    }
  });
};

export const getRootCategories = async () => {
  return await prisma.category.findMany({
    where: {
      parentId: null
    },
    include: {
      children: true
    }
  });
};

export const getCategoryWithChildren = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          children: true // Include one additional level for nested display
        }
      }
    }
  });
};

export const getAllCategoriesHierarchy = async () => {
  // Get all categories
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
    },
    orderBy: {
      name: 'asc'
    }
  });
  
  // Build a tree structure
  const categoryMap = new Map();
  const rootCategories = [];
  
  // First, create a map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });
  
  // Then, build the tree structure
  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id);
    
    if (category.parentId) {
      // If this category has a parent, add it to the parent's children array
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(categoryWithChildren);
      }
    } else {
      // If no parent, it's a root category
      rootCategories.push(categoryWithChildren);
    }
  });
  
  return rootCategories;
};

export const createCategory = async (name, parentId = null) => {
  return await prisma.category.create({
    data: { 
      name,
      parentId: parentId || null
    },
  });
};

export const updateCategory = async (id, name, parentId = null) => {
  // Prevent circular references by checking if the new parent is a child of this category
  if (parentId) {
    const isCircular = await checkForCircularReference(id, parentId);
    if (isCircular) {
      throw new Error('Cannot set parent: this would create a circular reference');
    }
  }
  
  return await prisma.category.update({
    where: { id },
    data: { 
      name,
      parentId: parentId || null
    },
  });
};

export const deleteCategory = async (id) => {
  // First, check if category has children - if so, prevent deletion or handle appropriately
  const categoryWithChildren = await prisma.category.findUnique({
    where: { id },
    include: { children: true }
  });
  
  if (categoryWithChildren && categoryWithChildren.children.length > 0) {
    // Option 1: Move children to parent category, or Option 2: Prevent deletion
    // For now, let's prevent deletion if it has children
    throw new Error('Cannot delete category with children');
  }
  
  return await prisma.category.delete({
    where: { id },
  });
};

// Helper function to check for circular references
async function checkForCircularReference(categoryId, newParentId) {
  if (categoryId === newParentId) {
    return true; // Direct circular reference
  }
  
  // Check if newParentId is a child of categoryId (indirect circular reference)
  let currentParentId = newParentId;
  while (currentParentId) {
    if (currentParentId === categoryId) {
      return true; // Indirect circular reference found
    }
    
    const parentCategory = await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { parentId: true }
    });
    
    currentParentId = parentCategory?.parentId;
  }
  
  return false;
}

export const findCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};