# 💼 E-Commerce Backend API

Back-end RESTful API untuk aplikasi e-commerce. Dibuat menggunakan **Node.js**, **Express**, dan **Prisma ORM**, dengan database **PostgreSQL**.

## 🚀 Fitur Utama

- 🔐 Autentikasi menggunakan JWT (Token di cookie)
- 👤 Manajemen user & admin (role-based access)
- 📦 CRUD produk & **hierarchical kategori** (parent-child relationships)
- 🖼️ **Multiple images per produk** dengan upload ke Cloudinary
- 🛒 Keranjang belanja
- 🧾 Checkout & pemesanan
- 💳 Simulasi payment gateway
- 🏗️ Arsitektur **service layer** yang terpisah dari controllers
- 🛠️ **Utility functions** untuk validasi, autentikasi, dan response standar
- ⚠️ **Global error handling** dengan AppError class
- 📂 API dokumentasi lengkap di [`API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md)

---

## 🛠️ Tech Stack

- **Node.js + Express** – Backend framework
- **Prisma ORM** – Query builder modern
- **PostgreSQL** – Relational database
- **JWT** – Autentikasi token
- **Multer + Cloudinary** – Upload & hosting gambar produk
- **Cookie-parser** – Menyimpan token di cookie
- **dotenv** – Mengelola environment variables
- **Winston** – Logging (info, warn, error, query)
- **Zod** – Validation schema untuk input sanitization

---

## 📁 Struktur Folder

```
ecommerce-backend/
├── docs/
│   └── API_DOCUMENTATION.md    # Dokumentasi endpoint lengkap
├── prisma/                     # Prisma schema & migrations
├── src/
│   ├── config/                 # Konfigurasi (Prisma, Multer, dll)
│   ├── controllers/            # Logic untuk tiap fitur (auth, products, orders, etc)
│   ├── middlewares/            # Auth & role-check middleware
│   ├── routes/                 # Routing Express
│   ├── services/               # Logic bisnis terpisah dari controller
│   ├── utils/                  # Utility functions (validasi, auth, error handling, dll)
│   └── server.js               # Setup express app
├── .env                        # Environment variables
└── README.md
```

---

## ⚙️ Setup & Instalasi

1. **Clone repository:**

```bash
git clone https://github.com/ets028/ecommerce-backend.git
cd ecommerce-backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Atur environment variable:**

Buat file `.env` dan isi:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"
BCRYPT_SALT_ROUNDS=10

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

4. **Setup database dan Prisma:**

```bash
npx prisma migrate dev --name init
```

5. **Jalankan server:**

```bash
npm run dev
```

Server berjalan di `http://localhost:5000`

---

## 📝 Logging

Sistem logging telah diimplementasikan menggunakan Winston dengan fitur:

- **HTTP Request/Response Logging**: Semua permintaan dan respons API dicatat
- **Database Query Logging**: Semua query database dicatat termasuk durasi eksekusi
- **Error Logging**: Semua error aplikasi dicatat dengan stack trace
- **Info/Warning Logging**: Event penting dan peringatan sistem dicatat
- **File Logs**: Log disimpan dalam folder `logs/` dengan pembagian error.log dan combined.log

---

## ✅ Validation

Sistem validasi input telah diimplementasikan menggunakan Zod dengan fitur:

- **Schema-based Validation**: Validasi berbasis skema untuk semua input API
- **Type Safety**: Validasi tipe data langsung dari skema
- **Custom Error Messages**: Pesan error yang informatif dan spesifik
- **Automatic Sanitization**: Pembersihan dan sanitasi input otomatis
- **Comprehensive Coverage**: Validasi untuk semua endpoint utama (produk, kategori, keranjang, order, auth)

---

## 👤 User Profile Management

Fitur manajemen profil pengguna telah diimplementasikan dengan:

- **Profile Completion Requirement**: Pengguna harus melengkapi profil sebelum bisa melakukan order
- **Alamat Lengkap**: Pengguna bisa menyimpan informasi alamat lengkap (phone, address, city, province, postal code, country)
- **Validasi ketat**: Validasi lengkap untuk semua field profil
- **Status pelengkapan**: Sistem otomatis menandai apakah profil sudah lengkap atau belum
- **API endpoint**: Endpoint untuk update dan retrieve profile

---

## 🔍 Search, Filter & Pagination

Fitur pencarian, filter, dan pagination telah diimplementasikan dengan:

- **Pencarian global**: Pencarian berdasarkan nama produk atau deskripsi
- **Filter lengkap**: Filter berdasarkan harga, kategori, dan produk diskon
- **Pagination**: Sistem halaman untuk mengatur jumlah item per halaman
- **Sorting**: Pengurutan berdasarkan berbagai kriteria (harga, nama, tanggal, stok)
- **Parameter fleksibel**: Query parameter untuk mengatur semua fitur pencarian
- **Endpoint khusus**: Endpoint untuk pencarian produk berdasarkan kategori

---

## 📚 Dokumentasi API

Cek [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 🥪 Testing (Opsional)

Bisa digunakan tools seperti Postman, Thunder Client, atau cURL untuk menguji endpoint.

---

## 🡩‍💻 Kontribusi

Pull request & issue sangat disambut jika kamu ingin mengembangkan lebih lanjut.

---

## 📄 Lisensi

MIT License.
