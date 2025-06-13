# 💼 E-Commerce Backend API

Back-end RESTful API untuk aplikasi e-commerce. Dibuat menggunakan **Node.js**, **Express**, dan **Prisma ORM**, dengan database **MySQL**.

## 🚀 Fitur Utama

- 🔐 Autentikasi menggunakan JWT (Token di cookie)
- 👤 Manajemen user & admin (role-based access)
- 📦 CRUD produk & kategori
- 🛒 Keranjang belanja
- 🧾 Checkout & pemesanan
- 💳 Simulasi payment gateway
- 📂 API dokumentasi lengkap di [`API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md)

---

## 🛠️ Tech Stack

- **Node.js + Express** – Backend framework
- **Prisma ORM** – Query builder modern
- **MySQL** – Relational database
- **JWT** – Autentikasi token
- **Cookie-parser** – Menyimpan token di cookie
- **dotenv** – Mengelola environment variables

---

## 📁 Struktur Folder

```
ecommerce-backend/
├── docs/
│   └── API_DOCUMENTATION.md    # Dokumentasi endpoint lengkap
├── prisma/                     # Prisma schema & migrations
├── src/
│   ├── controllers/            # Logic untuk tiap fitur (auth, products, orders, etc)
│   ├── routes/                 # Routing Express
│   ├── middlewares/            # Auth & role-check middleware
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
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
JWT_SECRET="secret_token"
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
