# Service Booking Backend — API Documentation

**Base URL (Local):** `http://localhost:5000`
**Base URL (Live):** `https://service-booking-backend-inhk.onrender.com`

All responses follow this structure:
{
"success": true,
"message": "Description of what happened",
"data": {}
}

Protected routes require a header:
Authorization: Bearer <token>

---

## 1. Auth APIs (/api/auth)

### Register — POST /api/auth/register (No auth)

Body: { "name", "email", "password", "role"?, "phone"? }
Success 201 → user object (no password)
Errors: 400 (missing fields / email exists), 500

### Login — POST /api/auth/login (No auth)

Body: { "email", "password" }
Success 200 → { user, token }
Errors: 400, 401

## 2. User APIs (/api/users) — ADMIN only, Bearer token required

- GET / → all users
- GET /:id → single user
- PUT /:id → update { name?, phone?, role? }
- DELETE /:id → soft delete

## 3. Category APIs (/api/categories)

- GET / , GET /:id → public
- POST / , PUT /:id , DELETE /:id → ADMIN only
  Create body: { "name", "description"? }

## 4. Service APIs (/api/services)

- GET / , GET /:id → public
- POST / , PUT /:id , DELETE /:id → PROVIDER/ADMIN only
  Create body: { "title", "description"?, "price", "categoryId" }
  (providerId auto-filled from token)

## 5. Booking APIs (/api/bookings) — Bearer token required for all

- GET / , GET /:id → any logged-in user
- POST / → CUSTOMER only, body: { "bookingDate", "serviceId" }
- PUT /:id/status → PROVIDER/ADMIN only, body: { "status": "PENDING|CONFIRMED|COMPLETED|CANCELLED" }
- DELETE /:id → soft delete

## 6. Review APIs (/api/reviews)

- GET / , GET /:id → public
- POST / → CUSTOMER only, body: { "rating", "comment"?, "serviceId" }
- PUT /:id , DELETE /:id → CUSTOMER / logged-in user

## Common Status Codes

200 OK · 201 Created · 400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 500 Server Error
