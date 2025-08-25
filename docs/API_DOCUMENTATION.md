# 💼 E-Commerce API Documentation

## 🧾 Auth

### 🔐 Register

**Endpoint:**
`POST /api/auth/register`

**Request Body:**

```json
{
  "email": "user@mail.com",
  "password": "123456",
  "name": "Iyan"
}
```

---

### 🔐 Login

**Endpoint:**
`POST /api/auth/login`

**Request Body:**

```json
{
    "message": "Login berhasil.",
    "user": {
        "id": "cmeqjohel0000flatzc6jmd86",
        "email": "admin@mail.com"
    },
    "token": "token..."
}
```

📦 **Response:**

* Set-Cookie berisi token **JWT**

---

## 👤 User

### 👤 Get Profile

**Endpoint:**
`GET /api/user/profile`
🔒 Protected (User)

---

## 📦 Products

### 📔 List Products

**Endpoint:**
`GET /api/products`
📖 Public

**Response:**

```json
[
  {
        "id": "cme892...",
        "name": "T-Shirt Polos Katun",
        "description": "Kaos nyaman bahan katun combed 30s, cocok untuk sehari-hari.",
        "price": 75000,
        "stock": 50,
        "imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080",
        "createdAt": "2025-08-25T03:15:38.419Z",
        "updatedAt": "2025-08-25T03:15:38.419Z",
        "userId": "cmeqjohel0000flatzc6jmd86",
        "categoryId": "cme3...",
        "category": {
            "id": "cme3...",
            "name": "Pakaian",
            "createdAt": "2025-08-25T03:15:38.410Z",
            "updatedAt": "2025-08-25T03:15:38.410Z"
        }
    }
]
```

---

### ➕ Add Product

**Endpoint:**
`POST /api/products`
🔒 Protected (User)

**Request Body:**

```json
{
  "name": "T-Shirt",
  "description": "Comfortable cotton",
  "price": 50000,
  "stock": 10,
  "imageUrl": "https://img.com/tshirt.jpg",
  "categoryId": 1
}
```

📌 **Catatan:**
Produk otomatis dikaitkan dengan pengguna yang sedang login (`userId` dari token otentikasi).

---

### 🔀 Update Product

**Endpoint:**
`PUT /api/products/:id`
🔒 Admin only

---

### ❌ Delete Product

**Endpoint:**
`DELETE /api/products/:id`
🔒 Admin only

---

## 🏗️ Categories

### 📔 List Categories

**Endpoint:**
`GET /api/categories`
📖 Public

---

### ➕ Add Category

**Endpoint:**
`POST /api/categories`
🔒 Admin only

**Request Body:**

```json
{
  "name": "Clothing"
}
```

---

## 🛒 Cart

### 📔 Get My Cart

**Endpoint:**
`GET /api/cart`
🔒 Protected (User)

---

### ➕ Add to Cart

**Endpoint:**
`POST /api/cart`
🔒 Protected

**Request Body:**

```json
{
  "productId": "cwea..",
  "quantity": 2
}
```

---

### ❌ Remove from Cart

**Endpoint:**
`DELETE /api/cart/remove/:productId`
🔒 Protected

---

## 🧾 Orders

### 📦 Create Order from Cart

**Endpoint:**
`POST /api/orders`
🔒 Protected (User)

---

### 📔 Get My Orders

**Endpoint:**
`GET /api/orders`
🔒 Protected

---

### 📋 Admin: Get All Orders

**Endpoint:**
`GET /api/orders/admin/all`
🔒 Admin only

---

### ⚙️ Admin: Update Order Status

**Endpoint:**
`PUT /api/orders/:id/status`
🔒 Admin only

**Request Body:**

```json
{
  "status": "shipped"
}
```

---

### ❌ Admin: Delete Order

**Endpoint:**
`DELETE /api/orders/admin/:id`
🔒 Admin only

---

## 💳 Payment (Simulasi)

### 💸 Simulate Payment

**Endpoint:**
`POST /api/payment/:orderId/simulate`
🔒 Protected (User)

📝 **Catatan:**

* Order harus dalam status: `pending`
* `paymentStatus`: `pending`

Jika berhasil:

```json
{
  "paymentStatus": "paid",
  "paidAt": "<timestamp sekarang>"
}
```

---

## ⚠️ Middleware

* `authRequired`: Semua endpoint kecuali register/login memerlukan autentikasi.
* `adminOnly`: Hanya bisa diakses oleh user dengan role `'admin'`.

---

## ✅ Status Kode

| Kode | Arti                                         |
| ---- | -------------------------------------------- |
| 200  | OK - Berhasil                                |
| 201  | Created - Data berhasil dibuat               |
| 400  | Bad Request - Permintaan tidak valid         |
| 401  | Unauthorized - Belum login / token salah     |
| 403  | Forbidden - Akses ditolak (bukan admin/user) |
| 404  | Not Found - Data tidak ditemukan             |
| 500  | Server Error - Kesalahan dari server         |

---

