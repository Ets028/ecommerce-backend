import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai menghapus data lama...');
  
  // Hapus data dalam urutan yang benar (untuk menghindari constraint violation)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Data lama terhapus!');

  // 1. Buat Admin dan Users
  console.log('Membuat users...');
  const adminPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      profileCompleted: true,
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      province: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: 'Indonesia',
    },
  });

  const users = [];
  for (let i = 0; i < 9; i++) {
    const userPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `user${i + 1}@example.com`,
        password: userPassword,
        profileCompleted: faker.datatype.boolean(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: 'Indonesia',
      },
    });
    users.push(user);
  }
  const allUsers = [admin, ...users];

  // 2. Buat Categories (Root/Parent & Children)
  console.log('Membuat categories...');
  
  // Buat 5 root categories (tanpa parent)
  const rootCategories = [];
  const rootCategoryNames = ['Elektronik', 'Fashion', 'Rumah Tangga', 'Olahraga', 'Kecantikan'];
  
  for (let i = 0; i < 5; i++) {
    const rootCategory = await prisma.category.create({
      data: {
        name: rootCategoryNames[i],
      },
    });
    rootCategories.push(rootCategory);
  }

  // Buat 15 child categories dengan nama yang lebih spesifik
  const childCategoriesData = [
    // Child untuk Elektronik
    { name: 'Smartphone', parent: rootCategories[0] },
    { name: 'Laptop', parent: rootCategories[0] },
    { name: 'Tablet', parent: rootCategories[0] },
    // Child untuk Fashion
    { name: 'Pakaian Pria', parent: rootCategories[1] },
    { name: 'Pakaian Wanita', parent: rootCategories[1] },
    { name: 'Sepatu', parent: rootCategories[1] },
    { name: 'Aksesoris', parent: rootCategories[1] },
    // Child untuk Rumah Tangga
    { name: 'Perabotan Dapur', parent: rootCategories[2] },
    { name: 'Dekorasi', parent: rootCategories[2] },
    { name: 'Kebersihan', parent: rootCategories[2] },
    // Child untuk Olahraga
    { name: 'Alat Fitness', parent: rootCategories[3] },
    { name: 'Sepatu Olahraga', parent: rootCategories[3] },
    { name: 'Pakaian Olahraga', parent: rootCategories[3] },
    // Child untuk Kecantikan
    { name: 'Skincare', parent: rootCategories[4] },
    { name: 'Makeup', parent: rootCategories[4] },
  ];

  const childCategories = [];
  for (const childData of childCategoriesData) {
    const childCategory = await prisma.category.create({
      data: {
        name: childData.name,
        parentId: childData.parent.id,
      },
    });
    childCategories.push(childCategory);
  }

  const allCategories = [...rootCategories, ...childCategories];

  // 3. Buat Products dengan gambar
  console.log('Membuat products...');
  const products = [];
  const productImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', // Headphones
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500', // Camera
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',   // Smartwatch
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500',  // Sneakers
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', // Running Shoes
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500', // Perfume
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', // Nike Shoes
    'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=500', // Kitchen
    'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=500', // Dress
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', // Sunglasses
  ];

  for (let i = 0; i < 20; i++) {
    const basePrice = parseFloat(faker.commerce.price({ min: 50000, max: 500000 }));
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: basePrice,
        salePrice: Math.random() > 0.7 ? basePrice * 0.8 : null,
        stock: faker.number.int({ min: 0, max: 100 }),
        userId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        categoryId: allCategories[Math.floor(Math.random() * allCategories.length)].id,
        ProductImage: {
          create: [
            {
              imageUrl: productImages[i % productImages.length],
              isMain: true,
            },
            {
              imageUrl: productImages[(i + 1) % productImages.length],
              isMain: false,
            },
            {
              imageUrl: productImages[(i + 2) % productImages.length],
              isMain: false,
            },
          ],
        },
      },
      include: {
        ProductImage: true,
      },
    });
    products.push(product);
  }

  // 4. Buat Cart Items dengan kombinasi unik
  console.log('Membuat cart items...');
  const cartItemsCreated = new Set();
  
  for (let i = 0; i < 20; i++) {
    let userId, productId, key;
    
    // Cari kombinasi user-product yang belum ada
    do {
      userId = allUsers[Math.floor(Math.random() * allUsers.length)].id;
      productId = products[Math.floor(Math.random() * products.length)].id;
      key = `${userId}-${productId}`;
    } while (cartItemsCreated.has(key));
    
    cartItemsCreated.add(key);
    
    await prisma.cartItem.create({
      data: {
        productId: productId,
        userId: userId,
        quantity: faker.number.int({ min: 1, max: 5 }),
      },
    });
  }

  // 5. Buat Orders dan Order Items
  console.log('Membuat orders...');
  for (let i = 0; i < 20; i++) {
    const order = await prisma.order.create({
      data: {
        userId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        total: 0,
        status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
        paymentStatus: faker.helpers.arrayElement(['pending', 'paid', 'failed']),
        paidAt: Math.random() > 0.5 ? faker.date.recent() : null,
      },
    });

    // Buat 1-3 order items per order
    let orderTotal = 0;
    const itemsCount = faker.number.int({ min: 1, max: 3 });
    
    for (let j = 0; j < itemsCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = product.salePrice || product.price;
      orderTotal += price * quantity;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: quantity,
          price: price,
        },
      });
    }

    // Update total order
    await prisma.order.update({
      where: { id: order.id },
      data: { total: orderTotal },
    });
  }

  console.log('Seed data berhasil dibuat!');
  console.log('='.repeat(50));
  console.log(`Admin: admin@example.com / password123`);
  console.log(`Total Users: ${allUsers.length}`);
  console.log(`Total Root Categories: ${rootCategories.length}`);
  console.log(`Total Child Categories: ${childCategories.length}`);
  console.log(`Total Products: ${products.length}`);
  console.log('='.repeat(50));
  console.log('Root Categories:');
  rootCategories.forEach((cat, index) => {
    console.log(`  ${index + 1}. ${cat.name}`);
  });
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });