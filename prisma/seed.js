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
    { name: 'Laptop & Komputer', parent: rootCategories[0] },
    { name: 'Pakaian Pria', parent: rootCategories[1] },
    { name: 'Pakaian Wanita', parent: rootCategories[1] },
    { name: 'Perabotan Dapur', parent: rootCategories[2] },
    { name: 'Dekorasi Rumah', parent: rootCategories[2] },
    { name: 'Alat Fitness', parent: rootCategories[3] },
    { name: 'Sepatu Olahraga', parent: rootCategories[3] },
    { name: 'Skincare', parent: rootCategories[4] },
    { name: 'Makeup', parent: rootCategories[4] },
    { name: 'Aksesoris Mobil', parent: rootCategories[5] },
    { name: 'Perawatan Kendaraan', parent: rootCategories[5] },
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

  // 3. Buat 30 Products dengan nama, gambar, dan kategori yang sesuai
  console.log('Membuat 30 products dengan nama, gambar, dan kategori yang sesuai...');
  
  // Definisikan produk dengan kategori dan gambar yang sesuai
  const productDefinitions = [
    // Smartphone (4 produk)
    {
      name: 'iPhone 15 Pro Max 256GB',
      description: 'iPhone 15 Pro Max dengan chip A17 Pro, kamera 48MP, dan baterai tahan lama',
      categoryName: 'Smartphone',
      price: 18999000,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung flagship dengan S Pen, kamera 200MP, dan layar Dynamic AMOLED 2X',
      categoryName: 'Smartphone',
      price: 15999000,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro',
      description: 'Smartphone mid-range dengan kamera 200MP dan fast charging 120W',
      categoryName: 'Smartphone',
      price: 5499000,
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Google Pixel 8 Pro',
      description: 'Pixel terbaru dengan AI Google Tensor G3 dan kamera terbaik',
      categoryName: 'Smartphone',
      price: 12999000,
      images: [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
      ]
    },

    // Laptop & Komputer (4 produk)
    {
      name: 'MacBook Air M3 13 inch',
      description: 'Laptop tipis dan ringan dengan chip M3, cocok untuk produktivitas',
      categoryName: 'Laptop & Komputer',
      price: 22999000,
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'ASUS ROG Strix G15',
      description: 'Gaming laptop dengan RTX 4060 dan processor Intel Core i7',
      categoryName: 'Laptop & Komputer',
      price: 18999000,
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Dell XPS 13 Plus',
      description: 'Laptop premium dengan layar InfinityEdge dan desain minimalis',
      categoryName: 'Laptop & Komputer',
      price: 21999000,
      images: [
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      description: 'Laptop bisnis dengan keyboard terbaik dan daya tahan baterai panjang',
      categoryName: 'Laptop & Komputer',
      price: 19999000,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop'
      ]
    },

    // Pakaian Pria (3 produk)
    {
      name: 'Kemeja Formal Pria Lengan Panjang',
      description: 'Kemeja formal bahan katun premium untuk acara resmi',
      categoryName: 'Pakaian Pria',
      price: 299000,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Jeans Slim Fit Pria',
      description: 'Celana jeans slim fit dengan bahan denim berkualitas',
      categoryName: 'Pakaian Pria',
      price: 349000,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Jaket Hoodie Pria Casual',
      description: 'Jaket hoodie nyaman untuk sehari-hari dengan desain modern',
      categoryName: 'Pakaian Pria',
      price: 249000,
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1578763460786-998d003c46c8?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=500&h=500&fit=crop'
      ]
    },

    // Pakaian Wanita (3 produk)
    {
      name: 'Dress Wanita Maxi Floral',
      description: 'Dress panjang dengan pattern floral yang elegan',
      categoryName: 'Pakaian Wanita',
      price: 459000,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1585487000113-27e7b5c5c1c9?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Blouse Wanita Silk',
      description: 'Blouse bahan silk dengan cutting yang feminine',
      categoryName: 'Pakaian Wanita',
      price: 329000,
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1589810635657-232948472d98?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Rok Wanita A-Line',
      description: 'Rok A-line dengan bahan flowy dan comfortable',
      categoryName: 'Pakaian Wanita',
      price: 279000,
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=500&h=500&fit=crop'
      ]
    },

    // Perabotan Dapur (3 produk)
    {
      name: 'Set Panci Stainless Steel 5pcs',
      description: 'Set panci lengkap untuk kebutuhan memasak sehari-hari',
      categoryName: 'Perabotan Dapur',
      price: 899000,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Blender Philips HR3752',
      description: 'Blender dengan teknologi ProMix untuk hasil yang halus',
      categoryName: 'Perabotan Dapur',
      price: 1299000,
      images: [
        'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Microwave Sharp R-728',
      description: 'Microwave dengan fitur inverter dan capacity 28L',
      categoryName: 'Perabotan Dapur',
      price: 1899000,
      images: [
        'https://images.unsplash.com/photo-1616128417747-49d0ca1e79d6?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop'
      ]
    },

    // Alat Fitness (3 produk)
    {
      name: 'Dumbell Set Adjustable 20kg',
      description: 'Set dumbell adjustable dari 5kg sampai 20kg',
      categoryName: 'Alat Fitness',
      price: 799000,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Yoga Mat Premium 8mm',
      description: 'Mat yoga tebal dengan material non-slip',
      categoryName: 'Alat Fitness',
      price: 299000,
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Treadmill Elektrik Folding',
      description: 'Treadmill elektrik bisa dilipat dengan berbagai program',
      categoryName: 'Alat Fitness',
      price: 4599000,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop'
      ]
    },

    // Skincare (3 produk)
    {
      name: 'Serum Vitamin C Brightening',
      description: 'Serum vitamin C untuk mencerahkan dan menyamarkan noda',
      categoryName: 'Skincare',
      price: 259000,
      images: [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Moisturizer Hydrating 24h',
      description: 'Pelembab dengan teknologi hydrating 24 jam',
      categoryName: 'Skincare',
      price: 189000,
      images: [
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Sunscreen SPF 50+ PA++++',
      description: 'Suncreen dengan proteksi tinggi dan texture lightweight',
      categoryName: 'Skincare',
      price: 149000,
      images: [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'
      ]
    },

    // Aksesoris Mobil (3 produk)
    {
      name: 'Car Seat Cover Premium',
      description: 'Cover jok mobil bahan leather dengan desain ergonomis',
      categoryName: 'Aksesoris Mobil',
      price: 899000,
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Steering Wheel Cover',
      description: 'Cover stir mobil dengan grip yang nyaman',
      categoryName: 'Aksesoris Mobil',
      price: 199000,
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Car Phone Holder Magnetic',
      description: 'Holder HP magnetic dengan base kuat',
      categoryName: 'Aksesoris Mobil',
      price: 129000,
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop'
      ]
    }
  ];

  const products = [];
  
  for (const productDef of productDefinitions) {
    // Cari category ID berdasarkan nama
    const category = allCategories.find(cat => cat.name === productDef.categoryName);
    if (!category) {
      console.log(`Category ${productDef.categoryName} not found, skipping product ${productDef.name}`);
      continue;
    }

    const hasSale = Math.random() > 0.7;
    const salePrice = hasSale ? productDef.price * faker.number.float({ min: 0.6, max: 0.9 }) : null;
    
    const product = await prisma.product.create({
      data: {
        name: productDef.name,
        description: productDef.description,
        price: productDef.price,
        salePrice: salePrice,
        stock: faker.number.int({ min: 10, max: 100 }),
        userId: users[Math.floor(Math.random() * users.length)].id,
        categoryId: category.id,
        ProductImage: {
          create: productDef.images.map((imageUrl, index) => ({
            imageUrl: imageUrl,
            isMain: index === 0, // Gambar pertama sebagai main image
          })),
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
  console.log(`📦 Products: ${products.length} (dengan nama dan gambar yang sesuai)`);
  console.log(`🖼️  Product Images: ${products.reduce((acc, product) => acc + product.ProductImage.length, 0)}`);
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
  console.log('\n🛍️  Sample Products by Category:');
  const categoriesWithProducts = {};
  products.forEach(product => {
    const categoryName = allCategories.find(cat => cat.id === product.categoryId)?.name || 'Unknown';
    if (!categoriesWithProducts[categoryName]) {
      categoriesWithProducts[categoryName] = [];
    }
    categoriesWithProducts[categoryName].push(product.name);
  });
  
  Object.entries(categoriesWithProducts).forEach(([category, productNames]) => {
    console.log(`\n  ${category}:`);
    productNames.slice(0, 3).forEach((name, index) => {
      console.log(`    ${index + 1}. ${name}`);
    });
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