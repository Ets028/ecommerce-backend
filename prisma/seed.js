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
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Data lama terhapus!');

  // 1. Buat 10 Users dengan role user
  console.log('Membuat 10 users...');
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        avatarUrl: faker.image.avatar(),
        userProfile: {
          create: {
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            province: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: 'Indonesia',
            profileCompleted: faker.datatype.boolean(),
          },
        },
      },
      include: {
        userProfile: true,
      },
    });
    users.push(user);
  }

  // 2. Buat 20 Categories dengan parent-child relationship
  console.log('Membuat 20 categories...');
  
  // Buat 8 root categories
  const rootCategories = [];
  const rootCategoryNames = [
    'Elektronik', 'Fashion', 'Rumah Tangga', 'Olahraga', 
    'Kecantikan', 'Otomotif', 'Hobi', 'Makanan & Minuman'
  ];
  
  for (let i = 0; i < 8; i++) {
    const rootCategory = await prisma.category.create({
      data: {
        name: rootCategoryNames[i],
      },
    });
    rootCategories.push(rootCategory);
  }

  // Buat 12 child categories
  const childCategories = [];
  const childCategoryNames = [
    { name: 'Smartphone', parent: rootCategories[0] },
    { name: 'Laptop', parent: rootCategories[0] },
    { name: 'Pakaian Pria', parent: rootCategories[1] },
    { name: 'Pakaian Wanita', parent: rootCategories[1] },
    { name: 'Perabotan Dapur', parent: rootCategories[2] },
    { name: 'Dekorasi Rumah', parent: rootCategories[2] },
    { name: 'Alat Fitness', parent: rootCategories[3] },
    { name: 'Sepatu Olahraga', parent: rootCategories[3] },
    { name: 'Skincare', parent: rootCategories[4] },
    { name: 'Makeup', parent: rootCategories[4] },
    { name: 'Aksesoris Mobil', parent: rootCategories[5] },
    { name: 'Perawatan Motor', parent: rootCategories[5] },
  ];

  for (const childData of childCategoryNames) {
    const childCategory = await prisma.category.create({
      data: {
        name: childData.name,
        parentId: childData.parent.id,
      },
    });
    childCategories.push(childCategory);
  }

  const allCategories = [...rootCategories, ...childCategories];

  // 3. Buat 20 Products dengan 3 images each
  console.log('Membuat 20 products dengan 3 images each...');
  const products = [];
  const productImageUrls = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop', // Camera
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',   // Smartwatch
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop',  // Sneakers
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', // Running Shoes
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&h=500&fit=crop', // Perfume
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop', // Nike Shoes
    'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=500&h=500&fit=crop', // Kitchen
    'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=500&h=500&fit=crop', // Dress
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', // Sunglasses
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop', // Fashion
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop', // Beauty
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop', // Health
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop', // Clothing
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop', // Electronics
  ];

  for (let i = 0; i < 20; i++) {
    const basePrice = parseFloat(faker.commerce.price({ min: 25000, max: 2500000 }));
    const hasSale = Math.random() > 0.7;
    
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: basePrice,
        salePrice: hasSale ? basePrice * faker.number.float({ min: 0.6, max: 0.9 }) : null,
        stock: faker.number.int({ min: 0, max: 100 }),
        userId: users[Math.floor(Math.random() * users.length)].id,
        categoryId: allCategories[Math.floor(Math.random() * allCategories.length)].id,
        ProductImage: {
          create: [
            {
              imageUrl: productImageUrls[i % productImageUrls.length],
              isMain: true,
            },
            {
              imageUrl: productImageUrls[(i + 1) % productImageUrls.length],
              isMain: false,
            },
            {
              imageUrl: productImageUrls[(i + 2) % productImageUrls.length],
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

  // 4. Buat 5 Cart Items
  console.log('Membuat 5 cart items...');
  const cartItemsCreated = new Set();
  
  for (let i = 0; i < 5; i++) {
    let userId, productId, key;
    
    // Cari kombinasi user-product yang belum ada
    do {
      userId = users[Math.floor(Math.random() * users.length)].id;
      productId = products[Math.floor(Math.random() * products.length)].id;
      key = `${userId}-${productId}`;
    } while (cartItemsCreated.has(key));
    
    cartItemsCreated.add(key);
    
    await prisma.cartItem.create({
      data: {
        productId: productId,
        userId: userId,
        quantity: faker.number.int({ min: 1, max: 3 }),
      },
    });
  }

  // 5. Buat 5 Orders dengan Order Items
  console.log('Membuat 5 orders...');
  for (let i = 0; i < 5; i++) {
    const orderUser = users[Math.floor(Math.random() * users.length)];
    const order = await prisma.order.create({
      data: {
        userId: orderUser.id,
        total: 0,
        status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
        paymentStatus: faker.helpers.arrayElement(['pending', 'paid', 'failed']),
        paidAt: Math.random() > 0.5 ? faker.date.recent() : null,
      },
    });

    // Buat 1-2 order items per order
    let orderTotal = 0;
    const itemsCount = faker.number.int({ min: 1, max: 2 });
    
    for (let j = 0; j < itemsCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = faker.number.int({ min: 1, max: 2 });
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

  // Tampilkan summary
  console.log('\n✅ Seed data berhasil dibuat!');
  console.log('='.repeat(50));
  console.log(`📊 SUMMARY:`);
  console.log(`👥 Users: ${users.length} (semua role: user)`);
  console.log(`🏷️  Categories: ${allCategories.length} (${rootCategories.length} root, ${childCategories.length} child)`);
  console.log(`📦 Products: ${products.length} (masing-masing dengan 3 images)`);
  console.log(`🛒 Cart Items: 5`);
  console.log(`🧾 Orders: 5`);
  console.log('='.repeat(50));
  console.log('\n🔐 Login credentials untuk testing:');
  console.log('Email: user1@example.com');
  console.log('Password: password123');
  console.log('\n📁 Root Categories:');
  rootCategories.forEach((cat, index) => {
    console.log(`  ${index + 1}. ${cat.name}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });