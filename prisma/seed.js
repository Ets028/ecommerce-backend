// seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Memulai proses seeding...');

  // 1. Hapus data lama (opsional, tapi disarankan untuk seeding yang bersih)
  // Urutan penghapusan penting untuk menghindari error foreign key constraint.
  await prisma.orderItem.deleteMany(); // Hapus item di order dulu
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Data lama berhasil dihapus.');

  // 2. Hash password
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);
  console.log('🔒 Password berhasil di-hash.');

  // 3. Buat Pengguna (User)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      name: 'Admin Ganteng',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@mail.com',
      name: 'Iyan Pengguna',
      password: hashedPasswordUser,
      role: 'USER',
    },
  });
  console.log(`👤 Pengguna berhasil dibuat: ${admin.name} (Admin) dan ${user.name} (User).`);

  // 4. Buat Kategori (Categories)
  const categoryPakaian = await prisma.category.create({
    data: {
      name: 'Pakaian',
    },
  });

  const categoryElektronik = await prisma.category.create({
    data: {
      name: 'Elektronik',
    },
  });
  console.log('🏗️ Kategori berhasil dibuat.');

  // 5. Buat Produk (Products)
  const productsData = [
    {
      name: 'T-Shirt Polos Katun',
      description: 'Kaos nyaman bahan katun combed 30s, cocok untuk sehari-hari.',
      price: 75000,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080',
      categoryId: categoryPakaian.id,
    },
    {
      name: 'Kemeja Flanel',
      description: 'Kemeja flanel lengan panjang dengan motif kotak-kotak.',
      price: 150000,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=2028',
      categoryId: categoryPakaian.id,
    },
    {
      name: 'Wireless Mouse Pro',
      description: 'Mouse wireless dengan DPI yang bisa diatur, ergonomis dan senyap.',
      price: 250000,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1615663249852-de56c6238834?q=80&w=1974',
      categoryId: categoryElektronik.id,
    },
    {
      name: 'Mechanical Keyboard RGB',
      description: 'Keyboard mekanikal dengan switch biru dan lampu RGB kustom.',
      price: 600000,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1618384887924-c9769359ce52?q=80&w=2070',
      categoryId: categoryElektronik.id,
    },
  ];

  // Tambahkan userId ke setiap produk menggunakan ID admin yang sudah dibuat
  const productsWithUser = productsData.map(product => ({
    ...product,
    userId: admin.id, // Menambahkan ID admin sebagai pemilik produk
  }));

  await prisma.product.createMany({
    data: productsWithUser,
  });
  console.log('📦 Produk berhasil dibuat.');

  console.log('✅ Proses seeding selesai!');
}

// Jalankan fungsi main dan tangani error
main()
  .catch((e) => {
    console.error('❌ Gagal melakukan seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Tutup koneksi Prisma
    await prisma.$disconnect();
  });