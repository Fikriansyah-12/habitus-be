# API Documentation - Dashboard "Request Jadwal Operasional"

## 📋 Daftar Lengkap API

### Authentication
- `POST /api/v1/auth/login` - Login dan dapatkan JWT token

### Customers
- `GET /api/v1/customers` - Dapatkan semua customers
- `GET /api/v1/customers/:id` - Dapatkan detail customer
- `POST /api/v1/customers` - Buat customer baru
- `PATCH /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Hapus customer

### Quotes
- `GET /api/v1/quotes` - Dapatkan semua quotes
- `GET /api/v1/quotes/:id` - Dapatkan detail quote
- `GET /api/v1/quotes/by-number/:quoteNo` - Cari quote by nomor
- `POST /api/v1/quotes` - Buat quote baru
- `PATCH /api/v1/quotes/:id` - Update quote
- `DELETE /api/v1/quotes/:id` - Hapus quote

### Onsite Requests (Dashboard Utama)
- `GET /api/v1/onsite-requests` - Dapatkan semua requests
- `GET /api/v1/onsite-requests/statistics` - Statistik requests
- `GET /api/v1/onsite-requests/:id` - Dapatkan detail request
- `POST /api/v1/onsite-requests` - Buat request baru
- `PATCH /api/v1/onsite-requests/:id` - Update request (hanya REQUESTED)
- `PATCH /api/v1/onsite-requests/:id/status` - Update status request
- `DELETE /api/v1/onsite-requests/:id` - Hapus request

---

## 1️⃣ AUTHENTICATION - Login

### POST /api/v1/auth/login

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tommy@example.com",
    "password": "password123"
  }'
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
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

**Test Users:**
```
Email: tommy@example.com / gina@example.com / test@example.com
Password: password123 (semua)
```

---

## 2️⃣ CUSTOMERS API

### GET /api/v1/customers

Dapatkan semua customers dengan quotes mereka.

**Request:**
```bash
curl http://localhost:3000/api/v1/customers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
[
  {
    "id": "cust-001",
    "name": "Cody Rhodes",
    "phone": "08123456789",
    "createdAt": "2025-12-18T18:09:00.586Z",
    "updatedAt": "2025-12-18T18:09:00.586Z",
    "quotes": [...]
  }
]
```

### POST /api/v1/customers

Buat customer baru.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/customers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "081234567890"
  }'
```

### PATCH /api/v1/customers/:id

Update customer.

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/customers/cust-001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "phone": "081234567890"
  }'
```

### DELETE /api/v1/customers/:id

Hapus customer.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/customers/cust-001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 3️⃣ QUOTES API

### GET /api/v1/quotes

Dapatkan semua quotes dengan items dan onsite requests.

**Request:**
```bash
curl http://localhost:3000/api/v1/quotes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### POST /api/v1/quotes

Buat quote baru dengan items.

**Request Body:**
```json
{
  "quoteNo": "001",
  "customerId": "cust-001",
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

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/quotes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quoteNo": "004",
    "customerId": "cust-001",
    "items": [
      {"name": "Item A", "qty": 1},
      {"name": "Item B", "qty": 2}
    ]
  }'
```

### GET /api/v1/quotes/by-number/:quoteNo

Cari quote berdasarkan nomor quote.

**Request:**
```bash
curl http://localhost:3000/api/v1/quotes/by-number/001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### PATCH /api/v1/quotes/:id

Update quote (akan me-replace items jika diberikan items baru).

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/quotes/quote-001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "New Item", "qty": 5}
    ]
  }'
```

---

## 4️⃣ ONSITE REQUESTS API (Dashboard Utama)

### GET /api/v1/onsite-requests

Dapatkan semua onsite requests dengan detail quotes, customers, dan items.

**Query Parameters:**
- `status` - Filter by status (REQUESTED, APPROVED, REJECTED)
- `quoteId` - Filter by quote ID

**Request:**
```bash
# Get all requests
curl http://localhost:3000/api/v1/onsite-requests \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get only REQUESTED
curl 'http://localhost:3000/api/v1/onsite-requests?status=REQUESTED' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get only APPROVED
curl 'http://localhost:3000/api/v1/onsite-requests?status=APPROVED' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
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

### POST /api/v1/onsite-requests

Buat onsite request baru.

**Request Body:**
```json
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

**Purpose Options:**
- `PENGIRIMAN_BARANG` - Pengiriman Barang
- `MEETING` - Meeting
- `SURVEY` - Survey
- `DOKUMENTASI` - Dokumentasi

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/onsite-requests \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "purpose": "MEETING",
    "onsiteAt": "2025-12-26T14:00:00Z",
    "address": "Jl. Sudirman No. 456, Bandung",
    "quoteId": "quote-002",
    "items": [
      {"name": "Konner Titan Black", "qty": 5}
    ]
  }'
```

### GET /api/v1/onsite-requests/:id

Dapatkan detail onsite request by ID.

**Request:**
```bash
curl http://localhost:3000/api/v1/onsite-requests/onsite-001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### PATCH /api/v1/onsite-requests/:id

Update onsite request (hanya jika status REQUESTED).

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/onsite-requests/onsite-001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Jl. Sudirman No. 123, Jakarta",
    "onsiteAt": "2025-12-26T10:00:00Z",
    "items": [
      {"name": "New Item", "qty": 3}
    ]
  }'
```

### PATCH /api/v1/onsite-requests/:id/status

Update status onsite request (REQUESTED → APPROVED → REJECTED).

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/onsite-requests/onsite-001/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED"
  }'
```

**Status Options:**
```json
{
  "status": "REQUESTED"  // atau "APPROVED" atau "REJECTED"
}
```

### GET /api/v1/onsite-requests/statistics

Dapatkan statistik requests.

**Request:**
```bash
curl http://localhost:3000/api/v1/onsite-requests/statistics \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "total": 3,
  "requested": 2,
  "approved": 1,
  "rejected": 0
}
```

### DELETE /api/v1/onsite-requests/:id

Hapus onsite request.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/onsite-requests/onsite-001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔑 Authorization

Semua endpoint (kecuali login) memerlukan JWT token di header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Cara Mendapatkan Token:**
1. Login dengan POST `/api/v1/auth/login`
2. Copy `access_token` dari response
3. Gunakan di header `Authorization: Bearer <token>`

---

## 📊 Table Response Format untuk Dashboard

Untuk menampilkan table di dashboard dengan kolom:
`Tanggal Pengajuan | Nama | Keperluan | Tanggal & Jam Onsite | Alamat | Nomor Quote | Nama Barang | Customer | Status`

**Gunakan endpoint:**
```bash
GET /api/v1/onsite-requests
```

**Response sudah termasuk:**
- ✅ Tanggal Pengajuan → `createdAt`
- ✅ Nama (User yang request) → `requestedBy.name`
- ✅ Keperluan → `purpose`
- ✅ Tanggal & Jam Onsite → `onsiteAt`
- ✅ Alamat → `address`
- ✅ Nomor Quote → `quote.quoteNo`
- ✅ Nama Barang → `items[*].name`
- ✅ Customer → `quote.customer.name`
- ✅ Status → `status`

---

## ✨ Base URL

```
http://localhost:3000/api/v1
```

---

## 🧪 Quick Test Script

```bash
#!/bin/bash

# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tommy@example.com", "password": "password123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Get all onsite requests
curl -X GET http://localhost:3000/api/v1/onsite-requests \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 3. Get statistics
curl -X GET http://localhost:3000/api/v1/onsite-requests/statistics \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 4. Get customers
curl -X GET http://localhost:3000/api/v1/customers \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## 📝 Notes

- Token expire dalam 7 hari
- Password di database di-hash dengan bcrypt (10 rounds)
- Semua tanggal format ISO 8601
- ID menggunakan CUID format
- Onsite requests hanya bisa di-update jika status REQUESTED
