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

📦 **Response:**

```json
{
  "success": true,
  "data": {
    "id": "cmeqjohel0000flatzc6jmd86",
    "email": "user@mail.com"
  },
  "message": "User berhasil didaftarkan."
}
```

---

### 🔐 Login

**Endpoint:**
`POST /api/auth/login`

**Request Body:**

```json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

📦 **Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cmeqjohel0000flatzc6jmd86",
      "email": "user@mail.com",
      "role": "user",
      "name": "Iyan",
      "avatarUrl": "https://avatar.iran.liara.run/public"
    }
  },
  "message": "Login berhasil."
}
```

⚠️ **Catatan:**
Token otomatis disimpan di cookie.

---

### 🔐 Google Login


**Endpoint:**

`GET /api/auth/google`

📖 Public


📦 **Redirect:**

Redirects to Google OAuth login page.


---


### 🔐 Google Login Callback


**Endpoint:**

`GET /api/auth/google/callback`

📖 Public


⚠️ **Catatan:**

This is the callback URL that Google redirects to after successful authentication.


📦 **Response:**


```json

{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "user": {
      "id": "cmeqjohel0000flatzc6jmd86",
      "email": "user@gmail.com",
      "name": "John Doe",
      "avatarUrl": "https://lh3.googleusercontent.com/...",
      "role": "user",
      "profileCompleted": false
    },
    "token": "jwt_token_here"
  }
}

```

## 👤 User

### 👤 Get Profile

**Endpoint:**
`GET /api/user/profile`
🔒 Protected (User)

📦 **Response:**

```json
{
  "success": true,
  "data": {
    "id": "cmeqjohel0000flatzc6jmd86",
    "name": "Iyan",
    "email": "user@mail.com",
    "avatarUrl": "https://avatar.iran.liara.run/public",
    "role": "user",
    "profileCompleted": false,
    "phone": null,
    "address": null,
    "city": null,
    "province": null,
    "postalCode": null,
    "country": "Indonesia"
  },
  "message": "User profile retrieved successfully"
}
```

---

### 🖼️ Update User Avatar

**Endpoint:**
`PUT /api/user/avatar`
🔒 Protected (User)
📁 Multipart/form-data with file in 'avatar' field

**Request Body:**
- `avatar`: Image file (jpg, jpeg, png, gif)

📦 **Response:**

```json
{
  "success": true,
  "data": {
    "id": "cmeqjohel0000flatzc6jmd86",
    "name": "Iyan",
    "email": "user@mail.com",
    "avatarUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/...",
    "role": "user"
  },
  "message": "User avatar updated successfully"
}
```

---

### 📋 Update User Profile

**Endpoint:**
`PUT /api/user/profile`
🔒 Protected (User)
✅ Validasi input dengan Zod schema

**Request Body:**
```json
{
  "phone": "081234567890",
  "address": "Jl. Merdeka No. 123",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postalCode": "12345",
  "country": "Indonesia"    // Optional, defaults to "Indonesia"
}
```

📦 **Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmeqjohel0000flatzc6jmd86",
    "name": "Iyan",
    "email": "user@mail.com",
    "avatarUrl": "https://avatar.iran.liara.run/public",
    "role": "user",
    "profileCompleted": true,    // true jika semua field wajib terisi
    "phone": "081234567890",
    "address": "Jl. Merdeka No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345",
    "country": "Indonesia"
  },
  "message": "User profile updated successfully"
}
```

---

## 📦 Products

### 📔 List Products

**Endpoint:**
```
📖 Public

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10, max: 100) - Number of items per page
- `search` (optional) - Search term for product name or description
- `category` (optional) - Filter by category ID
- `minPrice` (optional) - Minimum price filter
- `maxPrice` (optional) - Maximum price filter
- `sortBy` (optional, default: 'createdAt') - Field to sort by ('name', 'price', 'createdAt', 'updatedAt', 'stock')
- `sortOrder` (optional, default: 'desc') - Sort order ('asc' or 'desc')
- `saleOnly` (optional, default: 'false') - Filter for products on sale only

**Example:**
`/api/products?page=1&limit=10&search=shirt&category=cat123&minPrice=50000&maxPrice=100000&sortBy=price&sortOrder=asc&saleOnly=true`

📦 **Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "cme892...",
        "name": "T-Shirt Polos Katun",
        "description": "Kaos nyaman bahan katun combed 30s, cocok untuk sehari-hari.",
        "price": 75000,
        "salePrice": 65000,    // Optional - sale price if on promotion
        "stock": 50,
        "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v123456/product1.jpg",
        "createdAt": "2025-08-25T03:15:38.419Z",
        "updatedAt": "2025-08-25T03:15:38.419Z",
        "userId": "cmeqjohel0000flatzc6jmd86",
        "categoryId": "cme3...",
        "category": {
          "id": "cme3...",
          "name": "Pakaian",
          "createdAt": "2025-08-25T03:15:38.410Z",
          "updatedAt": "2025-08-25T03:15:38.410Z"
        },
        "ProductImage": [
          {
            "id": "img123",
            "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v123456/product1.jpg",
            "isMain": true,
            "createdAt": "2025-08-25T03:15:38.410Z"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Products retrieved successfully."
}
```

---

### 📔 List Products by Category

**Endpoint:**
`GET /api/products/category/:id`
📖 Public

**Query Parameters (same as above):**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10, max: 100) - Number of items per page
- `search` (optional) - Search term for product name or description
- `minPrice` (optional) - Minimum price filter
- `maxPrice` (optional) - Maximum price filter
- `sortBy` (optional, default: 'createdAt') - Field to sort by ('name', 'price', 'createdAt', 'updatedAt', 'stock')
- `sortOrder` (optional, default: 'desc') - Sort order ('asc' or 'desc')
- `saleOnly` (optional, default: 'false') - Filter for products on sale only

**Example:**
`/api/products/category/cat123?page=1&limit=10&search=shirt&minPrice=50000&maxPrice=100000`

📦 **Response:**
(Same structure as above but only for products in the specified category)

---
---

### ➕ Add Product

**Endpoint:**
`POST /api/products`
🔒 Protected (User)
✅ Validasi input dengan Zod schema: Input di validasi dengan Zod schema (name, description, price, stock wajib diisi, format harga positif, stok integer non negatif, dll)

**Request Body:**

```json
{
  "name": "T-Shirt",
  "description": "Comfortable cotton",
  "price": 50000,
  "salePrice": 45000,    // Optional - sale price if on promotion
  "stock": 10,
  "categoryId": "cat123"
}
```

---

### ➕ Add Product with Multiple Images

**Endpoint:**
`POST /api/products/create-with-images`
🔒 Protected (User)
✅ Validasi input dengan Zod schema: Input di validasi dengan Zod schema (name, description, price, stock wajib diisi, format harga positif, stok integer non negatif, dll)
📁 Multipart/form-data with file(s) in 'images' field

**Request Body:**
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `stock`: Product stock
- `categoryId`: Optional category ID
- `images`: Array of image files (max 10)

---

### ➕ Add Images to Existing Product

**Endpoint:**
`POST /api/products/:productId/images`
🔒 Protected (Product owner)
✅ Validasi input dengan Zod schema: `productId` wajib diisi
📁 Multipart/form-data with file(s) in 'images' field

**Request Body:**
- `images`: Array of image files (max 10)

---

### 🔄 Set Main Product Image

**Endpoint:**
`PUT /api/products/:productId/images/:imageId/set-main`
🔒 Protected (Product owner)
✅ Validasi input dengan Zod schema: `productId` dan `imageId` wajib diisi

---

### 🔀 Update Product

**Endpoint:**
`PUT /api/products/:id`
🔒 Protected (Product owner)
✅ Validasi input dengan Zod schema: Input di validasi dengan Zod schema (name, description, price, stock wajib diisi, format harga positif, stok integer non negatif, dll) dan `:id` wajib diisi

**Request Body:**

```json
{
  "name": "Updated T-Shirt",
  "description": "Comfortable cotton - updated",
  "price": 55000,
  "stock": 15
}
```

---

### ❌ Delete Product

**Endpoint:**
`DELETE /api/products/:id`
🔒 Protected (Product owner)
✅ Validasi input dengan Zod schema: `:id` wajib diisi

---

## 🏗️ Categories (Hierarchical)

### 📔 List Categories (Flat)

**Endpoint:**
`GET /api/categories`
📖 Public

---

### 📔 List Categories (Hierarchical Tree)

**Endpoint:**
`GET /api/categories/hierarchy`
📖 Public

📦 **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat123",
      "name": "Clothing",
      "createdAt": "2025-08-25T03:15:38.410Z",
      "updatedAt": "2025-08-25T03:15:38.410Z", 
      "parentId": null,
      "children": [
        {
          "id": "subcat456",
          "name": "T-Shirts",
          "createdAt": "2025-08-25T03:15:38.410Z",
          "updatedAt": "2025-08-25T03:15:38.410Z",
          "parentId": "cat123",
          "children": []
        }
      ]
    }
  ],
  "message": "Kategori dengan hierarki berhasil diambil."
}
```

---

### 📔 List Root Categories

**Endpoint:**
`GET /api/categories/root`
📖 Public

---

### 📔 Get Category by ID (with children)

**Endpoint:**
`GET /api/categories/:id`
📖 Public
✅ Validasi input dengan Zod schema: `:id` wajib diisi

---

### ➕ Add Category

**Endpoint:**
`POST /api/categories`
🔒 Admin only
✅ Validasi input dengan Zod schema: `name` wajib diisi

**Request Body:**

```json
{
  "name": "Clothing",
  "parentId": "parentCatId"  // Optional - for hierarchical structure
}
```

---

### 🔀 Update Category

**Endpoint:**
`PUT /api/categories/:id`
🔒 Admin only
✅ Validasi input dengan Zod schema: `:id` dan `name` wajib diisi

**Request Body:**

```json
{
  "name": "Updated Clothing",
  "parentId": "newParentCatId"  // Optional
}
```

---

### ❌ Delete Category

**Endpoint:**
`DELETE /api/categories/:id`
🔒 Admin only
✅ Validasi input dengan Zod schema: `:id` wajib diisi

⚠️ **Catatan:**
Kategori dengan sub-kategori tidak dapat dihapus.

---

## 🛒 Cart

### 📔 Get My Cart

**Endpoint:**
`GET /api/cart`
🔒 Protected (User)

📦 **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cart123",
      "productId": "prod123",
      "userId": "user123",
      "quantity": 2,
      "product": {
        "id": "prod123",
        "name": "T-Shirt",
        "price": 50000,
        // ... other product details
      }
    }
  ],
  "message": "Cart items retrieved successfully."
}
```

---

### ➕ Add to Cart

**Endpoint:**
`POST /api/cart/add`
🔒 Protected (User)
✅ Validasi input dengan Zod schema: `productId` dan `quantity` wajib diisi

**Request Body:**

```json
{
  "productId": "cwea..",
  "quantity": 2
}
```

---

### 🔀 Update Cart Item Quantity

**Endpoint:**
`PUT /api/cart/:productId`
🔒 Protected (User)
✅ Validasi input dengan Zod schema: `:productId` wajib diisi dan `quantity` wajib diisi dalam body

**Request Body:**

```json
{
  "quantity": 5
}
```

---

### ❌ Remove from Cart

**Endpoint:**
`DELETE /api/cart/:productId`
🔒 Protected (User)
✅ Validasi input dengan Zod schema: `:productId` wajib diisi

---

## 🧾 Orders

### 📦 Create Order from Cart

**Endpoint:**
⚠️ **Catatan:** User harus melengkapi profil (profileCompleted: true) sebelum bisa membuat order
`POST /api/orders`
🔒 Protected (User)

---

### 📔 Get My Orders

**Endpoint:**
`GET /api/orders`
🔒 Protected (User)

---

### 📔 Get Order by ID

**Endpoint:**
`GET /api/orders/:id`
🔒 Protected (User who owns the order)
✅ Validasi input dengan Zod schema: `:id` wajib diisi

---

### 📋 Admin: Get All Orders

**Endpoint:**
`GET /api/orders/admin`
🔒 Admin only

---

### ⚙️ Admin: Update Order Status

**Endpoint:**
`PUT /api/orders/:id/status`
🔒 Admin only
✅ Validasi input dengan Zod schema: `:id` wajib diisi dan `status` wajib diisi dalam body

**Request Body:**

```json
{
  "status": "shipped"
}
```

---

### ❌ Admin: Delete Order

**Endpoint:**
`DELETE /api/orders/:id`
🔒 Admin only
✅ Validasi input dengan Zod schema: `:id` wajib diisi

---

## 💳 Payment (Simulasi)

### 💸 Simulate Payment

**Endpoint:**
`POST /api/payment/:orderId/simulate`
🔒 Protected (User who owns the order)
✅ Validasi input dengan Zod schema: `:orderId` wajib diisi

📝 **Catatan:**

* Order harus dalam status: `pending`
* `paymentStatus`: `pending`

Jika berhasil:

```json
{
  "success": true,
  "data": {
    "id": "order123",
    "paymentStatus": "paid",
    "paidAt": "<timestamp sekarang>"
  },
  "message": "Pembayaran berhasil disimulasikan"
}
```

---

## ⚠️ Middleware

* `authRequired`: Memerlukan autentikasi JWT (token di cookie).
* `isAdmin`: Hanya bisa diakses oleh user dengan role `'admin'`.
* `isOwner('model')`: Memeriksa apakah user adalah pemilik dari resource tertentu.
* `validateBody(['field1', 'field2'])`: Memvalidasi bahwa field-field tertentu ada di request body.
* `validateParams(['param1', 'param2'])`: Memvalidasi bahwa parameter-parameter tertentu ada di URL.
* `isAuthenticated`: Middleware untuk memeriksa apakah user terautentikasi, tidak mengembalikan error jika tidak terautentikasi.

---

## ✅ Response Format

### Success Response Format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operational message"
}
```

### Error Response Format:
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

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

### ❌ Delete Product Image

**Endpoint:**
`DELETE /api/products/images/:imageId`
🔒 Protected (User)

---

### 🔀 Update Product

**Endpoint:**
`PUT /api/products/:id`
🔒 Protected (User who owns the product)

---

### ❌ Delete Product

**Endpoint:**
`DELETE /api/products/:id`
🔒 Protected (User who owns the product)

---

## 🏗️ Categories (Hierarchical)

### 📔 List Categories (Flat)

**Endpoint:**
`GET /api/categories`
📖 Public

---

### 📔 List Categories (Hierarchical Tree)

**Endpoint:**
`GET /api/categories/hierarchy`
📖 Public

📦 **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat123",
      "name": "Clothing",
      "createdAt": "2025-08-25T03:15:38.410Z",
      "updatedAt": "2025-08-25T03:15:38.410Z", 
      "parentId": null,
      "children": [
        {
          "id": "subcat456",
          "name": "T-Shirts",
          "createdAt": "2025-08-25T03:15:38.410Z",
          "updatedAt": "2025-08-25T03:15:38.410Z",
          "parentId": "cat123",
          "children": []
        }
      ]
    }
  ],
  "message": "Kategori dengan hierarki berhasil diambil."
}
```

---

### 📔 List Root Categories

**Endpoint:**
`GET /api/categories/root`
📖 Public

---

### 📔 Get Category by ID (with children)

**Endpoint:**
`GET /api/categories/:id`
📖 Public

---

### ➕ Add Category

**Endpoint:**
`POST /api/categories`
🔒 Admin only

**Request Body:**

```json
{
  "name": "Clothing",
  "parentId": "parentCatId"  // Optional - for hierarchical structure
}
```

---

### 🔀 Update Category

**Endpoint:**
`PUT /api/categories/:id`
🔒 Admin only

**Request Body:**

```json
{
  "name": "Updated Clothing",
  "parentId": "newParentCatId"  // Optional
}
```

---

### ❌ Delete Category

**Endpoint:**
`DELETE /api/categories/:id`
🔒 Admin only

⚠️ **Catatan:**
Kategori dengan sub-kategori tidak dapat dihapus.

---

## 🛒 Cart

### 📔 Get My Cart

**Endpoint:**
`GET /api/cart`
🔒 Protected (User)

📦 **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cart123",
      "productId": "prod123",
      "userId": "user123",
      "quantity": 2,
      "product": {
        "id": "prod123",
        "name": "T-Shirt",
        "price": 50000,
        // ... other product details
      }
    }
  ],
  "message": "Cart items retrieved successfully."
}
```

---

### ➕ Add to Cart

**Endpoint:**
`POST /api/cart`
🔒 Protected (User)

**Request Body:**

```json
{
  "productId": "cwea..",
  "quantity": 2
}
```

---

### 🔀 Update Cart Item Quantity

**Endpoint:**
`PUT /api/cart/:productId`
🔒 Protected (User)

**Request Body:**

```json
{
  "quantity": 5
}
```

---

### ❌ Remove from Cart

**Endpoint:**
`DELETE /api/cart/:productId`
🔒 Protected (User)

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
🔒 Protected (User)

---

### 📔 Get Order by ID

**Endpoint:**
`GET /api/orders/:id`
🔒 Protected (User who owns the order)

---

### 📋 Admin: Get All Orders

**Endpoint:**
`GET /api/orders`
🔒 Admin only

---

### ⚙️ Admin: Update Order Status

**Endpoint:**
`PUT /api/orders/:id`
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
`DELETE /api/orders/:id`
🔒 Admin only

---

## 💳 Payment (Simulasi)

### 💸 Simulate Payment

**Endpoint:**
`POST /api/payment/:orderId/simulate`
🔒 Protected (User who owns the order)

📝 **Catatan:**

* Order harus dalam status: `pending`
* `paymentStatus`: `pending`

Jika berhasil:

```json
{
  "success": true,
  "data": {
    "id": "order123",
    "paymentStatus": "paid",
    "paidAt": "<timestamp sekarang>"
  },
  "message": "Pembayaran berhasil disimulasikan"
}
```

---

## ⚠️ Middleware

* `authRequired`: Semua endpoint kecuali register/login memerlukan autentikasi.
* `adminOnly`: Hanya bisa diakses oleh user dengan role `'admin'`.

---

## ✅ Response Format

### Success Response Format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operational message"
}
```

### Error Response Format:
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

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

