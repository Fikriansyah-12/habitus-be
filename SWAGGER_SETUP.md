# 🎉 Swagger & API Documentation Setup Selesai!

## 📍 Akses Swagger Documentation

### URL Utama:
```
http://localhost:3000/api/docs
```

## 📚 Fitur Swagger yang Tersedia

### ✅ Endpoints Tersedia:

#### **Authentication**
- `POST /api/v1/auth/login` - Login dengan email & password

#### **Customers**
- `GET /api/v1/customers` - Dapatkan semua customers
- `GET /api/v1/customers/:id` - Detail customer
- `POST /api/v1/customers` - Buat customer baru
- `PATCH /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Hapus customer

#### **Quotes**
- `GET /api/v1/quotes` - Dapatkan semua quotes
- `GET /api/v1/quotes/:id` - Detail quote
- `GET /api/v1/quotes/by-number/:quoteNo` - Cari by nomor
- `POST /api/v1/quotes` - Buat quote baru
- `PATCH /api/v1/quotes/:id` - Update quote
- `DELETE /api/v1/quotes/:id` - Hapus quote

#### **Onsite Requests** ⭐ (Dashboard Utama)
- `GET /api/v1/onsite-requests` - Dapatkan semua requests
- `GET /api/v1/onsite-requests/statistics` - Statistik requests
- `GET /api/v1/onsite-requests/:id` - Detail request
- `POST /api/v1/onsite-requests` - Buat request baru
- `PATCH /api/v1/onsite-requests/:id` - Update request
- `PATCH /api/v1/onsite-requests/:id/status` - Update status
- `DELETE /api/v1/onsite-requests/:id` - Hapus request

---

## 🔐 Authentication di Swagger

1. Klik tombol **"Authorize"** (kunci gembok 🔒) di atas kanan
2. Copy JWT token dari response login
3. Paste ke field dan klik "Authorize"

**Test User:**
```
Email: tommy@example.com
Password: password123
```

---

## 🧪 Quick Test Steps

### 1. **Login**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "tommy@example.com",
  "password": "password123"
}
```

### 2. **Copy Token** dari response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-tommy-001",
    "email": "tommy@example.com",
    "name": "Tommy"
  }
}
```

### 3. **Authorize di Swagger**
- Klik "Authorize" button
- Paste token ke field
- Klik "Authorize"

### 4. **Test API**
- Sekarang semua endpoint bisa ditest langsung di Swagger UI

---

## 📋 Contoh Request/Response di Swagger

### Login Response:
```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### Get Onsite Requests Response:
```json
[
  {
    "id": "onsite-001",
    "requestedById": "user-tommy-001",
    "purpose": "PENGIRIMAN_BARANG",
    "onsiteAt": "2025-12-25T02:00:00.000Z",
    "address": "Jl. Merdeka No. 123, Jakarta",
    "status": "REQUESTED",
    "quoteId": "quote-001",
    "createdAt": "2025-12-18T18:09:01.131Z",
    "updatedAt": "2025-12-18T18:09:01.131Z",
    "requestedBy": {
      "id": "user-tommy-001",
      "name": "Tommy",
      "email": "tommy@example.com"
    },
    "quote": {
      "id": "quote-001",
      "quoteNo": "001",
      "customer": {
        "id": "cust-001",
        "name": "Cody Rhodes",
        "phone": "08123456789"
      }
    },
    "items": [
      {
        "id": "cmjbr8cfp0006ijh2j3h5kn4",
        "requestId": "onsite-001",
        "name": "Bakpau Handle",
        "qty": 2
      }
    ]
  }
]
```

---

## 🎯 Key Information

- **Base URL:** `http://localhost:3000/api/v1`
- **Swagger UI:** `http://localhost:3000/api/docs`
- **JWT Expiration:** 7 hari
- **Password Hashing:** bcrypt (10 rounds)
- **Database:** PostgreSQL

---

## ✨ Features

✅ Complete CRUD operations for Customers, Quotes, Onsite Requests
✅ JWT authentication with bearer token
✅ Request validation with class-validator
✅ API documentation with Swagger/OpenAPI
✅ Filter and query support
✅ Proper error handling
✅ CORS enabled
✅ Helmet security headers
✅ Global pipes for transformation

---

## 📝 Notes untuk Development

1. **Swagger bisa diakses** dari URL: `http://localhost:3000/api/docs`
2. **Semua endpoint sudah documented** dengan deskripsi lengkap
3. **Response examples** sudah tersedia untuk setiap endpoint
4. **Request body** sudah ada validation dan examples
5. **Authentication** sudah terintegrasi dengan JWT guard

---

## 🚀 Deployment

Untuk production:
1. Ubah `NODE_ENV` ke `production`
2. Update `.env` dengan credentials yang aman
3. Set JWT_SECRET yang kuat
4. Disable CORS if needed, configure specific origins
5. Build: `pnpm build`
6. Run: `pnpm start:prod` atau `node dist/src/main`

---

Semua API siap untuk diintegrasikan dengan frontend! 🎉
