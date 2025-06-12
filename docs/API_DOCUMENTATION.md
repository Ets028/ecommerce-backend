# 💼 E-Commerce API Documentation

## 🧾 Auth

### 🔐 Register

**POST** `/api/auth/register`

#### Request Body:

```json
{
  "email": "user@mail.com",
  "password": "123456",
  "name": "Iyan"
}
```

### 🔐 Login

**POST** `/api/auth/login`

#### Request Body:

```json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

📦 Response: `Set-Cookie` berisi token JWT

---

## 👤 User

### 👤 Get Profile

**GET** `/api/user/profile`
🔒 Protected (User)

---

## 📦 Products

### 📔 List Products

**GET** `/api/products`
📖 Public

### ➕ Add Product

**POST** `/api/products`
🔒 Protected (user)

#### Body:

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

### 🔀 Update Product

**PUT** `/api/products/:id`
🔒 Admin only

### ❌ Delete Product

**DELETE** `/api/products/:id`
🔒 Admin only

---

## 🏗️ Categories

### 📔 List Categories

**GET** `/api/categories`
📖 Public

### ➕ Add Category

**POST** `/api/categories`
🔒 Admin only

#### Body:

```json
{
  "name": "Clothing"
}
```

---

## 🛒 Cart

### 📔 Get My Cart

**GET** `/api/cart`
🔒 Protected (User)

### ➕ Add to Cart

**POST** `/api/cart`
🔒 Protected

#### Body:

```json
{
  "productId": 1,
  "quantity": 2
}
```

### ❌ Remove from Cart

**DELETE** `/api/cart/remove/:productId`
🔒 Protected

---

## 🧾 Orders

### 📦 Create Order from Cart

**POST** `/api/orders`
🔒 Protected (User)

### 📔 Get My Orders

**GET** `/api/orders`
🔒 Protected

### 📋 Admin: Get All Orders

**GET** `/api/orders/admin/all`
🔒 Admin only

### ⚙️ Admin: Update Status

**PUT** `/api/orders/:id/status`
🔒 Admin only

#### Body:

```json
{ "status": "shipped" }
```

### ❌ Admin: Delete Order

**DELETE** `/api/orders/admin/:id`
🔒 Admin only

---

## 💳 Payment (Simulasi)

### 💸 Simulate Payment

**POST** `/api/payment/:orderId/simulate`
🔒 Protected (User)

- Order dengan `status: pending` dan `paymentStatus: pending`
- Jika berhasil:
  - `paymentStatus`: `paid`
  - `paidAt`: timestamp sekarang

---

## ⚠️ Middleware

- `authRequired`: semua endpoint kecuali register/login perlu auth
- `adminOnly`: validasi `req.user.role === 'admin'`

---

## ✅ Status Kode

- `200 OK` - Berhasil
- `201 Created` - Data dibuat
- `400 Bad Request` - Request salah
- `401 Unauthorized` - Belum login / token invalid
- `403 Forbidden` - Role tidak sesuai
- `404 Not Found` - Data tidak ditemukan
- `500 Server Error` - Gagal server
