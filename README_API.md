# 🚀 Habitus Backend - Dashboard Request Jadwal Operasional

Backend API lengkap untuk dashboard "Request Jadwal Operasional" tim Habitus.

## 📚 Dokumentasi

- **Swagger UI:** http://localhost:3000/api/docs
- **Full API Docs:** `API_DOCUMENTATION.md`
- **Swagger Setup:** `SWAGGER_SETUP.md`

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm (recommended) atau npm

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment
Buat file `.env` di root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/habitus?schema=public"
JWT_SECRET="super-secret-jangan-di-share"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

### 3. Setup Database
```bash
# Run migrations
npx prisma migrate dev

# Seed data (users, customers, quotes, requests)
npx prisma db seed
```

### 4. Run Application
```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start
```

Server akan jalan di `http://localhost:3000`

---

## 📊 API Overview

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints Summary

#### 1. **Authentication** 🔐
```
POST /auth/login
```
Login dengan email & password, dapatkan JWT token

#### 2. **Customers** 👥
```
GET    /customers              # List all
GET    /customers/:id          # Detail
POST   /customers              # Create
PATCH  /customers/:id          # Update
DELETE /customers/:id          # Delete
```

#### 3. **Quotes** 📄
```
GET    /quotes                 # List all
GET    /quotes/:id             # Detail
GET    /quotes/by-number/:no   # By nomor
POST   /quotes                 # Create
PATCH  /quotes/:id             # Update
DELETE /quotes/:id             # Delete
```

#### 4. **Onsite Requests** ⭐ (Main Dashboard)
```
GET    /onsite-requests                # List all
GET    /onsite-requests/statistics     # Stats
GET    /onsite-requests/:id            # Detail
POST   /onsite-requests                # Create
PATCH  /onsite-requests/:id            # Update
PATCH  /onsite-requests/:id/status     # Update status
DELETE /onsite-requests/:id            # Delete
```

---

## 🧪 Test Users

Semua password: `password123`

| Name | Email | Role |
|------|-------|------|
| Tommy | tommy@example.com | User |
| Gina | gina@example.com | User |
| Test User | test@example.com | User |

---

## 🔑 Authentication

### 1. Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "tommy@example.com",
  "password": "password123"
}
```

Response:
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

### 2. Use Token
Include token di header untuk semua request:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💾 Database Schema

### Users
```
id, name, email (unique), password (hashed), createdAt, updatedAt
```

### Customers
```
id, name, phone, createdAt, updatedAt
```

### Quotes
```
id, quoteNo (unique), customerId (FK), createdAt, updatedAt
└─ QuoteItems: name, qty
```

### OnsiteRequests ⭐
```
id, requestedById (FK), purpose, onsiteAt, address, status, quoteId (FK), 
createdAt, updatedAt
└─ OnsiteRequestItems: name, qty
```

**Status Values:**
- `REQUESTED` - Request baru (default)
- `APPROVED` - Request disetujui
- `REJECTED` - Request ditolak

**Purpose Values:**
- `PENGIRIMAN_BARANG`
- `MEETING`
- `SURVEY`
- `DOKUMENTASI`

---

## 📋 Example: Create Onsite Request

```bash
POST /api/v1/onsite-requests
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "purpose": "PENGIRIMAN_BARANG",
  "onsiteAt": "2025-12-25T09:00:00Z",
  "address": "Jl. Merdeka No. 123, Jakarta",
  "quoteId": "quote-001",
  "items": [
    {
      "name": "Bakpau Handle",
      "qty": 2
    },
    {
      "name": "SAYAP Handle",
      "qty": 1
    }
  ]
}
```

Response:
```json
{
  "id": "onsite-123",
  "requestedById": "user-tommy-001",
  "purpose": "PENGIRIMAN_BARANG",
  "onsiteAt": "2025-12-25T09:00:00.000Z",
  "address": "Jl. Merdeka No. 123, Jakarta",
  "status": "REQUESTED",
  "quoteId": "quote-001",
  "createdAt": "2025-12-19T10:30:00.000Z",
  "updatedAt": "2025-12-19T10:30:00.000Z",
  "requestedBy": {
    "id": "user-tommy-001",
    "name": "Tommy",
    "email": "tommy@example.com"
  },
  "quote": {...},
  "items": [...]
}
```

---

## 📊 Dashboard Data Structure

Response dari `GET /api/v1/onsite-requests` sudah siap untuk table dashboard:

**Kolom yang dibutuhkan:**
1. ✅ Tanggal Pengajuan → `createdAt`
2. ✅ Nama → `requestedBy.name`
3. ✅ Keperluan → `purpose`
4. ✅ Tanggal & Jam Onsite → `onsiteAt`
5. ✅ Alamat → `address`
6. ✅ Nomor Quote → `quote.quoteNo`
7. ✅ Nama Barang → `items[*].name` (join dengan comma)
8. ✅ Customer → `quote.customer.name`
9. ✅ Status → `status` (REQUESTED/APPROVED/REJECTED)

---

## 🎨 Filter & Query

### Get Onsite Requests dengan Filter
```bash
# Get hanya REQUESTED
GET /api/v1/onsite-requests?status=REQUESTED

# Get hanya APPROVED
GET /api/v1/onsite-requests?status=APPROVED

# Filter by Quote
GET /api/v1/onsite-requests?quoteId=quote-001

# Kombinasi filter
GET /api/v1/onsite-requests?status=REQUESTED&quoteId=quote-001
```

---

## 🛠️ Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/
│   ├── entities/
│   ├── guards/
│   ├── strategies/
│   └── auth.controller.ts
├── customer/                # Customer management
│   ├── customer.controller.ts
│   ├── customer.service.ts
│   └── customer.module.ts
├── quote/                   # Quote management
│   ├── quote.controller.ts
│   ├── quote.service.ts
│   └── quote.module.ts
├── onsite-request/          # Main dashboard module
│   ├── dto/
│   ├── onsite-request.controller.ts
│   ├── onsite-request.service.ts
│   └── onsite-request.module.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
```

---

## 📦 Built With

- **NestJS** - Backend framework
- **Prisma** - ORM & Database
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Swagger** - API Documentation
- **Class Validator** - Input validation
- **Bcrypt** - Password hashing

---

## 🚀 Deployment

### Docker (Recommended)
```bash
docker build -t habitus-be .
docker run -p 3000:3000 --env-file .env habitus-be
```

### Cloud Deployment
1. Set environment variables di platform (Vercel, Railway, Heroku, etc)
2. Database: Bisa gunakan managed PostgreSQL (Supabase, Railway, Heroku Postgres)
3. Build: `pnpm build`
4. Start: `npm start` atau sesuaikan dengan platform

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Database connection error
- Cek `.env` DATABASE_URL
- Ensure PostgreSQL running
- Cek credentials

### Migration error
```bash
npx prisma migrate reset  # Warning: Will drop data
npx prisma migrate dev    # Create new migration
```

### Swagger not loading
- Clear browser cache
- Check `http://localhost:3000/api/docs`
- Ensure app is running

---

## 📞 API Support

- Lihat `API_DOCUMENTATION.md` untuk detail lengkap
- Lihat `SWAGGER_SETUP.md` untuk Swagger info
- Test di Swagger UI: `http://localhost:3000/api/docs`

---

## 📄 License

ISC

---

**Created by:** AI Assistant
**Date:** December 19, 2025
**Status:** ✅ Production Ready
